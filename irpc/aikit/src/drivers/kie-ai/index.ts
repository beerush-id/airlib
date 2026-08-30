import { getContext } from '@irpclib/irpc';
import { AIAdapter } from '../../adapter.js';
import type { AIDriver } from '../../types.js';

export class KIEDriver implements AIDriver {
  public async submit(input: Record<string, unknown>) {
    const apiKey = getContext('KIE_API_KEY');
    if (!apiKey) throw AIAdapter.next();

    return {
      text: 'KIE',
    };
  }
}

export const KIE_DRIVER = new KIEDriver();
