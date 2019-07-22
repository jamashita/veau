import { RuntimeError } from '../veau-error/RuntimeError';
import { Limit } from './Limit';
import { Offset } from './Offset';
import { ValueObject } from './ValueObject';

const LIMIT: number = 40;

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

  public getLimit(): Limit {
    return Limit.of(LIMIT);
  }

  public getOffset(): Offset {
    const offset: number = (this.page - 1) * LIMIT;
    return Offset.of(offset);
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
