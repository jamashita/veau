export interface ICache {

  set(identifier: symbol, value: unknown): void;

  get<H>(identifier: symbol): H;
}
