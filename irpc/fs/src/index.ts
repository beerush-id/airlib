import { createPackage, IRPCBlob, IRPCFile, type IRPCMeta } from '@irpclib/irpc';
import { z } from 'zod';
import type { AnyType } from './types.js';

export * from './constant.js';
export * from './error.js';

export const fsModule = createPackage({ name: 'fs', version: '1.0.0' });

export interface FSMeta<T = Record<string, AnyType>> extends IRPCMeta {
  prefix: string;
  thumbnailPrefix?: string;
  rollback?: Set<() => Promise<void>>;
  response?: FSEntry<T> | FSEntry<T>[];
}

export const pathSchema = z.string().min(1, 'File path is required');
export const fileSchema = z.custom<IRPCFile>((val) => val instanceof IRPCFile, 'Must be an IRPCFile');
export const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
export type JsonLiteral = z.infer<typeof literalSchema>;
export type JsonType = JsonLiteral | { [key: string]: JsonType } | JsonType[];
export const jsonSchema: z.ZodType<JsonType> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(z.string(), jsonSchema)])
);

export const payloadSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  size: z.number().optional(),
  type: z.string().optional(),
  isDirectory: z.boolean().optional(),

  // Organization
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),

  // Custom Application Data
  metadata: z.record(z.string(), jsonSchema).optional(),

  // Multi-Tenant Scoping
  userId: z.string().optional(),
  organizationId: z.string().optional(),
  projectId: z.string().optional(),

  // Extension Domains
  status: z.enum(['pending', 'ready', 'failed']).optional(),
  hash: z.string().optional(),
  sourcePath: z.string().optional(),
  embeddings: z.array(z.number()).optional(),
});

export const entrySchema = payloadSchema.extend({
  path: z.string(),
  directory: z.string(),
  name: z.string(),
  type: z.string(),
  isDirectory: z.boolean(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type FSPayload<T = Record<string, AnyType>> = Omit<z.infer<typeof payloadSchema>, 'metadata'> & {
  metadata?: T;
};

export type FSEntry<T = Record<string, AnyType>> = Omit<z.infer<typeof entrySchema>, 'metadata'> & {
  metadata?: T;
};

export class FSFile<T = Record<string, AnyType>> extends IRPCFile {
  declare meta: FSPayload<T> & { size: number; type: string };

  constructor(meta: FSPayload<T>, data: Blob) {
    const fileMeta = {
      size: data.size,
      type: meta.type || data.type || 'application/octet-stream',
      name: meta.name || 'file',
      ...meta,
    };
    super(fileMeta, data);
  }
}

export interface FSBlob<T = Record<string, AnyType>> extends IRPCBlob {
  meta: FSEntry<T>;
}

export interface FSReadResult<T = Record<string, AnyType>> {
  data: FSBlob<T>;
  file: FSEntry<T>;
}

const emptyFile: <T>() => FSEntry<T> = () => ({
  path: '',
  directory: '',
  name: '',
  type: '',
  isDirectory: false,
  createdAt: 0,
  updatedAt: 0,
});

export type FSCreate<T = AnyType> = (path: string, entry?: FSPayload<T>) => Promise<FSEntry<T>>;
export type FSRead<T = AnyType> = (path: string) => Promise<FSReadResult<T>>;
export type FSWrite<T = AnyType> = (path: string, file: IRPCFile) => Promise<FSEntry<T>>;
export type FSRemove = (path: string) => Promise<boolean>;
export type FSRemDir = (path: string, recursive?: boolean) => Promise<boolean>;
export type FSDir<T = AnyType> = (path?: string) => Promise<FSEntry<T>[]>;
export type FSMkdir<T = AnyType> = (path: string, entry?: FSPayload<T>) => Promise<FSEntry<T>>;
export type FSStat<T = AnyType> = (path: string) => Promise<FSEntry<T>>;
export type FSMove<T = AnyType> = (from: string, to: string, entry?: FSPayload<T>) => Promise<FSEntry<T>>;
export type FSCopy<T = AnyType> = (from: string, to: string, entry?: FSPayload<T>) => Promise<FSEntry<T>>;
export type FSUpdate<T = AnyType> = (path: string, entry: FSPayload<T>, file?: IRPCFile) => Promise<FSEntry<T>>;
export type FSExists = (path: string) => Promise<boolean>;

export const fs = {
  create: fsModule.declare<FSCreate>({
    name: 'fs.create',
    seed: emptyFile,
    schema: { input: [pathSchema, payloadSchema.optional()] },
  }),
  read: fsModule.declare<FSRead>({
    name: 'fs.read',
    seed: () => ({ data: new IRPCBlob('') as FSBlob, file: emptyFile() }),
    schema: { input: [pathSchema] },
  }),
  write: fsModule.declare<FSWrite>({
    name: 'fs.write',
    seed: emptyFile,
    schema: { input: [pathSchema, fileSchema] },
  }),
  update: fsModule.declare<FSUpdate>({
    name: 'fs.update',
    seed: emptyFile,
    schema: { input: [pathSchema, payloadSchema, fileSchema.optional()] },
  }),
  remove: fsModule.declare<FSRemove>({
    name: 'fs.remove',
    seed: () => false,
    schema: { input: [pathSchema] },
  }),
  rmdir: fsModule.declare<FSRemDir>({
    name: 'fs.rmdir',
    seed: () => false,
    schema: { input: [pathSchema, z.boolean().optional()] },
  }),
  dir: fsModule.declare<FSDir>({
    name: 'fs.dir',
    seed: () => [],
    schema: { input: [pathSchema.optional()] },
  }),
  mkdir: fsModule.declare<FSMkdir>({
    name: 'fs.mkdir',
    seed: emptyFile,
    schema: { input: [pathSchema, payloadSchema.optional()] },
  }),
  stat: fsModule.declare<FSStat>({
    name: 'fs.stat',
    seed: emptyFile,
    schema: { input: [pathSchema] },
  }),
  move: fsModule.declare<FSMove>({
    name: 'fs.move',
    seed: emptyFile,
    schema: { input: [pathSchema, pathSchema, payloadSchema.optional()] },
  }),
  copy: fsModule.declare<FSCopy>({
    name: 'fs.copy',
    seed: emptyFile,
    schema: { input: [pathSchema, pathSchema, payloadSchema.optional()] },
  }),
  exists: fsModule.declare<FSExists>({
    name: 'fs.exists',
    seed: () => false,
    schema: { input: [pathSchema] },
  }),
};

export interface TypedFSSuite<T = Record<string, AnyType>> {
  create: ReturnType<typeof fsModule.declare<FSCreate<T>>>;
  read: ReturnType<typeof fsModule.declare<FSRead<T>>>;
  write: ReturnType<typeof fsModule.declare<FSWrite<T>>>;
  remove: ReturnType<typeof fsModule.declare<FSRemove>>;
  rmdir: ReturnType<typeof fsModule.declare<FSRemDir>>;
  dir: ReturnType<typeof fsModule.declare<FSDir<T>>>;
  mkdir: ReturnType<typeof fsModule.declare<FSMkdir<T>>>;
  stat: ReturnType<typeof fsModule.declare<FSStat<T>>>;
  move: ReturnType<typeof fsModule.declare<FSMove<T>>>;
  copy: ReturnType<typeof fsModule.declare<FSCopy<T>>>;
  exists: ReturnType<typeof fsModule.declare<FSExists>>;
}

export function createFs<T = Record<string, AnyType>>(): TypedFSSuite<T> {
  return fs as unknown as TypedFSSuite<T>;
}
