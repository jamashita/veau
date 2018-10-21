export class ZeroHitsError extends Error {

  public constructor(message: string = 'ZERO HITS') {
    super(message);
  }
}

export class NotImplementedError extends Error {

  public constructor(message: string = 'NOT IMPLEMENTED') {
    super(message);
  }
}

export class NoSuchElementError extends Error {

  public constructor(message: string) {
    super(`NO SUCH KEY: ${message}`);
  }
}
