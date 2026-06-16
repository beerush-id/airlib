import { createPackage, IRPCFile } from '@irpclib/irpc';
export * from './error.js';
import { z } from 'zod';

/**
 * The core IRPC package for the filesystem module.
 */
export const fsModule = createPackage({ name: 'fs', version: '1.0.0' });

/**
 * Represents a file or directory entry in the filesystem without a payload pointer.
 */
export interface FSEntry {
  path: string;
  size: number;
  type: string;
  isDirectory?: boolean;
}

/**
 * Represents an accessible file with a payload pointer.
 */
export interface FSFile extends FSEntry {
  url: string;
}

export const pathSchema = z.string().min(1, 'File path is required');
export const fileSchema = z.custom<IRPCFile>((val) => val instanceof IRPCFile, 'Must be an IRPCFile');

/**
 * Signature for reading a file.
 * @param path - The file path to read.
 * @returns A promise resolving to the file representation.
 */
export type FSRead = (path: string) => Promise<FSFile>;

/**
 * Signature for writing a file.
 * @param path - The file path to write to.
 * @param file - The file data to write.
 * @returns A promise resolving to the updated file representation.
 */
export type FSWrite = (path: string, file: IRPCFile) => Promise<FSFile>;

/**
 * Signature for removing a file.
 * @param path - The file path to remove.
 * @returns A promise resolving to true if successful.
 */
export type FSRemove = (path: string) => Promise<boolean>;

/**
 * Signature for removing a directory.
 * @param path - The directory path to remove.
 * @param recursive - Whether to recursively remove all contents.
 * @returns A promise resolving to true if successful.
 */
export type FSRemDir = (path: string, recursive?: boolean) => Promise<boolean>;

/**
 * Signature for listing a directory.
 * @param path - The directory path to list (optional).
 * @returns A promise resolving to an array of entries in the directory.
 */
export type FSDir = (path?: string) => Promise<FSEntry[]>;

/**
 * The filesystem IRPC stubs.
 * Exposes methods to perform filesystem operations across the IRPC boundary.
 */
export const fs = {
  read: fsModule.declare<FSRead>({
    name: 'fs.read',
    seed: () => ({ path: '', url: '', size: 0, type: '' }),
    schema: { input: [pathSchema] },
  }),
  write: fsModule.declare<FSWrite>({
    name: 'fs.write',
    seed: () => ({ path: '', url: '', size: 0, type: '' }),
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
};
