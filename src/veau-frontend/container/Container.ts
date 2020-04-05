import { NoInstanceError } from './NoInstanceError';

export class Container {
  private readonly instances: Map<symbol, unknown>;

  public constructor() {
    this.instances = new Map<symbol, unknown>();
  }

  public bind(identifier: symbol, instance: unknown): void {
    this.instances.set(identifier, instance);
  }

  public get<C>(identifier: symbol): C {
    const instance: unknown | undefined = this.instances.get(identifier);

    if (instance === undefined) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new NoInstanceError(`NO SUCH INSTANCE: ${identifier.description}`);
    }

    return instance as C;
  }
}
