import { PageError } from '../Error/PageError';
import { Failure } from '../General/Try/Failure';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { Type } from '../General/Type/Type';
import { ValueObject } from '../General/ValueObject';
import { Limit } from './Limit';
import { Offset } from './Offset';

export class Page extends ValueObject {
  public readonly noun: 'Page' = 'Page';
  private readonly page: number;

  public static of(page: number): Try<Page, PageError> {
    if (page <= 0) {
      return Failure.of<Page, PageError>(new PageError(`ILLEGAL PAGE SPECIFIED ${page}`));
    }
    if (Type.isInteger(page)) {
      return Success.of<Page, PageError>(new Page(page));
    }

    return Failure.of<Page, PageError>(new PageError('ILLEGAL PAGE SPECIFIED'));
  }

  protected constructor(page: number) {
    super();
    this.page = page;
  }

  public get(): number {
    return this.page;
  }

  public getLimit(): Limit {
    return Limit.default();
  }

  public getOffset(): Offset {
    const offset: number = (this.page - 1) * this.getLimit().get();

    return Offset.of(offset).get();
  }

  public equals(other: Page): boolean {
    if (this === other) {
      return true;
    }
    if (this.page === other.page) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return `${this.page}`;
  }
}
