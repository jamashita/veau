export class NoSuchElementError extends Error {

  public constructor(message: string) {
    super(`NO SUCH KEY: ${message}`);
  }
}
