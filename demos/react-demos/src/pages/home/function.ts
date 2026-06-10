import type { RemoteState } from '@irpclib/irpc';
import { irpc } from '../../lib/module.js';
import { z } from 'zod';

export type WatchPriceFn = (symbol: string) => RemoteState<{ symbol: string; price: number }>;
export const watchPrice = irpc.declare<WatchPriceFn>({
  name: 'watchPrice',
  stream: true,
  seed: () => ({ symbol: '', price: 0 }),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  message: z.string().max(200, 'Keep it under 200 characters').optional(),
  updates: z.boolean().optional(),
});

export type ContactData = z.infer<typeof contactSchema>;

export type SubmitContactFn = (data: ContactData) => Promise<{ success: boolean; message: string }>;
export const submitContact = irpc.declare<SubmitContactFn>({
  name: 'submitContact',
  seed: () => ({ success: false, message: '' }),
});
