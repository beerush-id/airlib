import { AIDriverError } from './error.js';
import type { AIDriver, AIInput } from './types.js';

export class AINextAdapter extends Error {}

export class AIAdapter {
  private drivers = new Set<AIDriver>();

  public use(driver: AIDriver) {
    this.drivers.add(driver);
    return this;
  }

  protected async submit(input: AIInput) {
    for (const driver of this.drivers) {
      try {
        return await driver.submit(input);
      } catch (error) {
        if (error instanceof AINextAdapter) continue;
        throw error;
      }
    }

    throw AIDriverError.notImplemented();
  }

  static next() {
    return new AINextAdapter('Skipped');
  }
}
