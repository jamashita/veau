import { RuntimeError } from '../veau-general/RuntimeError';
import { Type } from '../veau-general/Type/Type';
import { ValueObject } from '../veau-general/ValueObject';
import { Limit } from './Limit';
import { Offset } from './Offset';

const LIMIT: number = 40;

export class Page extends ValueObject {
  private page: number;

  public static of(page: number): Page {
    if (page <= 0) {
      throw new RuntimeError(`ILLEGAL PAGE SPECIFIED ${page}`);
    }
    if (Type.isInteger(page)) {
      return new Page(page);
    }

    throw new RuntimeError(`ILLEGAL PAGE SPECIFIED ${page}`);
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
