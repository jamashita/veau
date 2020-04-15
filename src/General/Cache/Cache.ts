import { Ambiguous } from '../Type/Value';
import { CacheError } from './CacheError';
import { ICache } from './Interface/ICache';

export class Cache implements ICache {
  private readonly values: Map<symbol, unknown>;

  public constructor() {
    this.values = new Map<symbol, unknown>();
  }

  public set(identifier: symbol, value: unknown): void {
    this.values.set(identifier, value);
  }

  public get<H>(identifier: symbol): H {
    const instance: Ambiguous<unknown> = this.values.get(identifier);

    if (instance === undefined) {
      throw new CacheError(`NO SUCH IDENTIFIER: ${identifier.description}`);
    }

    return instance as H;
  }
}
