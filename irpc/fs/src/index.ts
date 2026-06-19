import { createPackage, IRPCFile, type IRPCMeta } from '@irpclib/irpc';
import { z } from 'zod';

export * from './constant.js';
export * from './error.js';

export const fsModule = createPackage({ name: 'fs', version: '1.0.0' });

export interface FSMeta extends IRPCMeta {
  prefix: string;
  thumbnailPrefix?: string;
}

export interface FSFile {
  path: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  type: string;
  isDirectory: boolean;
  createdAt: number;
  updatedAt: number;
}

export const pathSchema = z.string().min(1, 'File path is required');
export const fileSchema = z.custom<IRPCFile>((val) => val instanceof IRPCFile, 'Must be an IRPCFile');

const emptyFile: () => FSFile = () => ({
  path: '',
  url: '',
  size: 0,
  type: '',
  isDirectory: false,
  createdAt: 0,
  updatedAt: 0,
});

export type FSRead = (path: string) => Promise<FSFile>;
export type FSWrite = (path: string, file: IRPCFile) => Promise<FSFile>;
export type FSRemove = (path: string) => Promise<boolean>;
export type FSRemDir = (path: string, recursive?: boolean) => Promise<boolean>;
export type FSDir = (path?: string) => Promise<FSFile[]>;
export type FSMkdir = (path: string) => Promise<FSFile>;
export type FSStat = (path: string) => Promise<FSFile>;
export type FSMove = (from: string, to: string) => Promise<FSFile>;
export type FSCopy = (from: string, to: string) => Promise<FSFile>;
export type FSExists = (path: string) => Promise<boolean>;

export const fs = {
  read: fsModule.declare<FSRead>({
    name: 'fs.read',
    seed: emptyFile,
    schema: { input: [pathSchema] },
  }),
  write: fsModule.declare<FSWrite>({
    name: 'fs.write',
    seed: emptyFile,
    schema: { input: [pathSchema, fileSchema] },
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
    schema: { input: [pathSchema] },
  }),
  stat: fsModule.declare<FSStat>({
    name: 'fs.stat',
    seed: emptyFile,
    schema: { input: [pathSchema] },
  }),
  move: fsModule.declare<FSMove>({
    name: 'fs.move',
    seed: emptyFile,
    schema: { input: [pathSchema, pathSchema] },
  }),
  copy: fsModule.declare<FSCopy>({
    name: 'fs.copy',
    seed: emptyFile,
    schema: { input: [pathSchema, pathSchema] },
  }),
  exists: fsModule.declare<FSExists>({
    name: 'fs.exists',
    seed: () => false,
    schema: { input: [pathSchema] },
  }),
};
