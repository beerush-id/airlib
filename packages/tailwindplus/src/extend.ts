import { type AstNode } from './ast'
import type { DesignSystem } from './design-system'
import { DefaultMap } from './utils/default-map'
import { escape } from './utils/escape'
import { segment } from './utils/segment'
import { walk, WalkAction, type VisitContext } from './walk'

export interface ExtendGraph {
  extendMap: Map<string, Set<string>>
  conditionalDeps: Map<string, Set<string>>
  forcedCandidates: Set<string>
}

export function collectExtends(ast: AstNode[], _designSystem?: DesignSystem): ExtendGraph {
  let extendMap = new DefaultMap<string, Set<string>>(() => new Set())
  let conditionalDeps = new DefaultMap<string, Set<string>>(() => new Set())
  let forcedCandidates = new Set<string>()

  walk(ast, (node, ctx) => {
    if (node.kind === 'at-rule' && node.name === '@extend') {
      let structuralParents = ctx.path().filter(
        (n) => (n.kind === 'at-rule' && n.name === '@utility') || n.kind === 'rule',
      )
      if (structuralParents.length > 1) {
        node.name = '@apply'
        return
      }

      let enclosing = findEnclosingSelector(ctx)
      if (!enclosing) {
        throw new Error(`\`@extend ${node.params}\` cannot be used at the top level of a file.`)
      }

      let targets = parseExtendTargets(node.params)
      for (let target of targets) {
        let targetSelector = `.${escape(target)}`
        for (let sel of enclosing.selectors) {
          extendMap.get(targetSelector).add(sel)
        }

        if (enclosing.candidateName) {
          conditionalDeps.get(enclosing.candidateName).add(target)
        } else {
          forcedCandidates.add(target)
        }
      }

      return WalkAction.Replace([])
    }
  })

  detectCycles(conditionalDeps)

  return {
    extendMap,
    conditionalDeps,
    forcedCandidates,
  }
}

export function expandExtendCandidates(
  validCandidates: Set<string>,
  graph: ExtendGraph,
  designSystem: DesignSystem,
): boolean {
  let didChange = false
  let changed = true
  while (changed) {
    changed = false
    for (let candidate of validCandidates) {
      for (let node of designSystem.parseCandidate(candidate)) {
        if (node.kind !== 'static' && node.kind !== 'functional') continue
        let root = node.root
        let targets = graph.conditionalDeps.get(root)
        if (!targets || targets.size === 0) continue

        let idx = candidate.lastIndexOf(root)
        let prefix = idx !== -1 ? candidate.slice(0, idx) : ''

        for (let target of targets) {
          let targetCandidate = `${prefix}${target}`
          if (!validCandidates.has(targetCandidate)) {
            validCandidates.add(targetCandidate)
            changed = true
            didChange = true
          }
        }
      }
    }
  }
  return didChange
}

export function mergeExtendSelectors(
  ast: AstNode[],
  graph: ExtendGraph,
  validCandidates: Set<string>,
  designSystem: DesignSystem,
): void {
  if (graph.extendMap.size === 0 && graph.conditionalDeps.size === 0) return

  let effectiveMap = buildEffectiveExtendMap(graph, validCandidates, designSystem)

  walk(ast, (node) => {
    if (node.kind === 'rule') {
      let selectors = splitSelectorList(node.selector)
      let finalSet = new Set<string>(selectors)
      let queue = selectors.map((sel) => ({ selector: sel, visited: new Set<string>() }))

      while (queue.length > 0) {
        let current = queue.shift()!
        for (let [targetClass, extendingClasses] of effectiveMap) {
          if (current.visited.has(targetClass)) continue
          if (containsTargetClass(current.selector, targetClass)) {
            for (let ext of extendingClasses) {
              let merged = replaceTargetClass(current.selector, targetClass, ext)
              if (merged && !finalSet.has(merged)) {
                finalSet.add(merged)
                let nextVisited = new Set(current.visited)
                nextVisited.add(targetClass)
                queue.push({ selector: merged, visited: nextVisited })
              }
            }
          }
        }
      }

      if (finalSet.size > selectors.length) {
        node.selector = Array.from(finalSet).join(', ')
      }
    }
  })
}

function buildEffectiveExtendMap(
  graph: ExtendGraph,
  validCandidates: Set<string>,
  designSystem: DesignSystem,
): Map<string, Set<string>> {
  let effectiveMap = new DefaultMap<string, Set<string>>(() => new Set())

  for (let [target, sources] of graph.extendMap) {
    for (let source of sources) {
      effectiveMap.get(target).add(source)
    }
  }

  for (let candidate of validCandidates) {
    for (let node of designSystem.parseCandidate(candidate)) {
      if (node.kind !== 'static' && node.kind !== 'functional') continue
      let root = node.root
      let targets = graph.conditionalDeps.get(root)
      if (!targets || targets.size === 0) continue

      let idx = candidate.lastIndexOf(root)
      let prefix = idx !== -1 ? candidate.slice(0, idx) : ''
      if (!prefix) continue

      for (let target of targets) {
        let targetSelector = `.${escape(prefix + target)}`
        let baseTargetSelector = `.${escape(target)}`
        let baseSources = graph.extendMap.get(baseTargetSelector)
        if (baseSources && baseSources.size > 0) {
          let baseRootSelector = `.${escape(root)}`
          let newRootSelector = `.${escape(candidate)}`
          for (let src of baseSources) {
            if (containsTargetClass(src, baseRootSelector)) {
              let replaced = replaceTargetClass(src, baseRootSelector, newRootSelector)
              if (replaced) {
                effectiveMap.get(targetSelector).add(replaced)
              }
            }
          }
        } else {
          let sourceSelector = `.${escape(candidate)}`
          effectiveMap.get(targetSelector).add(sourceSelector)
        }
      }
    }
  }

  return effectiveMap
}

function detectCycles(conditionalDeps: Map<string, Set<string>>): void {
  let visited = new Set<string>()
  let visiting = new Set<string>()

  function visit(node: string, path: string[]) {
    if (visiting.has(node)) {
      let cycle = [...path.slice(path.indexOf(node)), node].join(' -> ')
      throw new Error(`Circular dependency detected in @extend: ${cycle}`)
    }
    if (visited.has(node)) return

    visiting.add(node)
    path.push(node)

    let deps = conditionalDeps.get(node)
    if (deps) {
      for (let dep of deps) {
        visit(dep, path)
      }
    }

    path.pop()
    visiting.delete(node)
    visited.add(node)
  }

  for (let node of conditionalDeps.keys()) {
    visit(node, [])
  }
}

function findEnclosingSelector(
  ctx: VisitContext<AstNode>,
): { selectors: string[]; candidateName: string | null } | null {
  for (let node of ctx.path()) {
    if (node.kind === 'at-rule' && node.name === '@utility') {
      let candidateName = node.params.replace(/-\*.*$/g, '')
      return {
        selectors: [`.${escape(candidateName)}`],
        candidateName,
      }
    } else if (node.kind === 'rule') {
      return {
        selectors: splitSelectorList(node.selector),
        candidateName: null,
      }
    }
  }

  return null
}

function parseExtendTargets(params: string): string[] {
  return params
    .split(/[\s,]+/g)
    .map((target) => target.trim())
    .filter(Boolean)
    .map((target) => (target.startsWith('.') ? target.slice(1) : target))
}

function containsTargetClass(selector: string, targetClass: string): boolean {
  let idx = 0
  while ((idx = selector.indexOf(targetClass, idx)) !== -1) {
    let endIdx = idx + targetClass.length
    if (!isIdentifierChar(selector[endIdx])) {
      return true
    }
    idx = endIdx
  }
  return false
}

function replaceTargetClass(
  selector: string,
  targetClass: string,
  replacementClass: string,
): string | null {
  let result = selector
  let replaced = false
  let idx = 0

  while ((idx = result.indexOf(targetClass, idx)) !== -1) {
    let endIdx = idx + targetClass.length
    if (!isIdentifierChar(result[endIdx])) {
      result = result.slice(0, idx) + replacementClass + result.slice(endIdx)
      replaced = true
      idx += replacementClass.length
    } else {
      idx = endIdx
    }
  }

  return replaced ? result : null
}

function splitSelectorList(selector: string): string[] {
  return segment(selector, ',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function isIdentifierChar(ch: string | undefined): boolean {
  if (!ch) return false
  let code = ch.charCodeAt(0)
  return (
    (code >= 0x30 && code <= 0x39) ||
    (code >= 0x41 && code <= 0x5a) ||
    (code >= 0x61 && code <= 0x7a) ||
    code === 0x5f ||
    code === 0x2d ||
    code === 0x5c
  )
}
