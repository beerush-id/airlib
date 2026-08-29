import { classx, colorScheme } from '@airlib/headless/utils';
import { type AnyType, query, sleep } from '@airlib/core';
import { mutable, render, setup, snippet } from '@airlib/react';
import type { ComponentProps } from 'react';
import type { HighlighterGeneric } from 'shiki';
import { CheckIcon } from 'src/icons/Check.tsx';
import { ContentPasetIcon } from 'src/icons/ContentPaste.tsx';
import { WarningIcon } from 'src/icons/Warning.tsx';
import { Icon } from '../icon/Icon.tsx';
import { CircularProgress } from '../progress/index.js';
import { ToolIconButton } from '../toolbar/Toolbar.tsx';
import { Tooltip } from '../tooltip/Tooltip.tsx';
import { CODE_BLOCK_CONFIGS } from './config.js';

let shikiInstance: HighlighterGeneric<AnyType, AnyType> | undefined;
let shikiPromise: Promise<HighlighterGeneric<AnyType, AnyType>> | undefined;

export type CodeBlockProps = ComponentProps<'div'> & {
  code: string | (() => string | Promise<string>) | Promise<string>;
  lang?: string;
  theme?: string | { light: string; dark: string };
};

export const CodeBlock = setup<CodeBlockProps>((props) => {
  const rest = props.$omit(['code', 'className', 'lang', 'theme']);
  const scheme = colorScheme();
  const state = mutable({ copied: false });
  const content = query(
    async () => {
      const lang = props.lang || CODE_BLOCK_CONFIGS.defaultLang;
      const lightTheme =
        typeof props.theme === 'object' ? props.theme.light : props.theme || CODE_BLOCK_CONFIGS.defaultLightTheme;
      const darkTheme =
        typeof props.theme === 'object' ? props.theme.dark : props.theme || CODE_BLOCK_CONFIGS.defaultDarkTheme;
      const theme = scheme.mode === 'system' ? undefined : scheme.mode === 'dark' ? darkTheme : lightTheme;
      const themes =
        scheme.mode === 'system'
          ? {
              light: lightTheme,
              dark: darkTheme,
            }
          : undefined;
      const options = theme ? { theme } : { themes };

      const rawCode = typeof props.code === 'function' ? await props.code() : await props.code;
      if (!rawCode) return { html: '' };

      const highlighter = await getHighlighter(lang, [lightTheme, darkTheme]);

      return {
        code: rawCode,
        html: highlighter.codeToHtml(rawCode, { lang, ...options } as never),
      };
    },
    { html: '' }
  );

  const handleCopy = async () => {
    if (state.copied) return;

    await copyCode(content.data?.code);
    state.copied = true;
    await sleep(2000);
    state.copied = false;
  };

  const Copy = snippet(() => (
    <ToolIconButton className={CODE_BLOCK_CONFIGS.copyClass} onClick={handleCopy}>
      <Icon>{state.copied ? <CheckIcon /> : <ContentPasetIcon />}</Icon>
      <Tooltip>{() => (state.copied ? 'Copied!' : 'Copy Code')}</Tooltip>
    </ToolIconButton>
  ));

  return render(() => {
    const className = classx([CODE_BLOCK_CONFIGS.class, props.className]);

    if (content.status === 'pending') {
      return (
        <div {...rest} className={className}>
          <div className={CODE_BLOCK_CONFIGS.pendingClass}>
            <CircularProgress indeterminate />
          </div>
        </div>
      );
    }

    if (content.status === 'error') {
      return (
        <div {...rest} className={className}>
          <div className={CODE_BLOCK_CONFIGS.errorClass}>
            <WarningIcon />
            <span>{content.error?.message || 'Failed to load code.'}</span>
          </div>
        </div>
      );
    }

    return (
      <div {...rest} className={className}>
        <div className={CODE_BLOCK_CONFIGS.innerClass} dangerouslySetInnerHTML={{ __html: content.data.html }}></div>
        <Copy />
      </div>
    );
  }, 'CodeBlock');
}, 'CodeBlock');

async function copyCode(code?: string) {
  if (!code) return;
  await navigator.clipboard.writeText(code);
}

async function getHighlighter(
  lang = CODE_BLOCK_CONFIGS.defaultLang,
  themes = [CODE_BLOCK_CONFIGS.defaultLightTheme, CODE_BLOCK_CONFIGS.defaultDarkTheme]
): Promise<HighlighterGeneric<AnyType, AnyType>> {
  if (!shikiPromise) {
    shikiPromise = (async () => {
      // @ts-expect-error
      const { createHighlighter } = await import('https://esm.sh/shiki@4.3.1');
      const instance = (await createHighlighter({
        langs: [lang],
        themes,
      })) as HighlighterGeneric<AnyType, AnyType>;
      shikiInstance = instance;
      return instance;
    })();
  }
  const instance = await shikiPromise;
  const loadedLangs = instance.getLoadedLanguages();
  if (!loadedLangs.includes(lang)) {
    await instance.loadLanguage(lang as AnyType).catch(() => {});
  }
  const loadedThemes = instance.getLoadedThemes();
  for (const theme of themes) {
    if (!loadedThemes.includes(theme)) {
      await instance.loadTheme(theme as AnyType).catch(() => {});
    }
  }
  return instance;
}
