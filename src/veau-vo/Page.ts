import { RuntimeError } from '../veau-error/RuntimeError';
import { ValueObject } from './ValueObject';

export class Page extends ValueObject {
  private page: number;

  public static of(page: number): Page {
    if (page <= 0) {
      throw new RuntimeError(`ILLEGAL PAGE SPECIFIED ${page}`);
    }

    return new Page(page);
  }

  private constructor(page: number) {
    super();
    this.page = page;
  }

  public get(): number {
    return this.page;
  }

  public equals(other: Page): boolean {
    if (this === other) {
      return true;
    }
    if (this.page === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.page.toString();
  }
}
