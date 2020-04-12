export abstract class RuntimeError extends Error {
  public abstract readonly name: string;

  protected constructor(message: string) {
    super(message);
  }
}
