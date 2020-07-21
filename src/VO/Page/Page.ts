import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';

import { OffsetError } from './Error/OffsetError';
import { PageError } from './Error/PageError';
import { Limit } from './Limit';
import { Offset } from './Offset';

const MIN_PAGE: number = 1;

export class Page extends ValueObject<Page, 'Page'> {
  public readonly noun: 'Page' = 'Page';
  private readonly page: number;
  private static readonly MIN: Page = new Page(MIN_PAGE);

  public static of(page: number): Superposition<Page, PageError> {
    if (page <= 0) {
      return Superposition.dead<Page, PageError>(new PageError(`ILLEGAL PAGE SPECIFIED ${page}`), PageError);
    }
    if (page === MIN_PAGE) {
      return Superposition.alive<Page, PageError>(Page.MIN, PageError);
    }
    if (Kind.isInteger(page)) {
      return Superposition.alive<Page, PageError>(new Page(page), PageError);
    }

    return Superposition.dead<Page, PageError>(new PageError('ILLEGAL PAGE SPECIFIED'), PageError);
  }

  public static min(): Page {
    return Page.MIN;
  }

  protected constructor(page: number) {
    super();
    this.page = page;
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

  public serialize(): string {
    return `${this.page}`;
  }

  public get(): number {
    return this.page;
  }

  public getLimit(): Superposition<Limit, PageError> {
    return Superposition.alive<Limit, PageError>(Limit.default(), PageError);
  }

  public getOffset(): Superposition<Offset, PageError> {
    return this.getLimit()
      .map<Offset, PageError | OffsetError>((limit: Limit) => {
        const offset: number = (this.page - 1) * limit.get();

        return Offset.of(offset);
      }, OffsetError)
      .recover<Offset, PageError>((err: PageError | OffsetError) => {
        if (err instanceof OffsetError) {
          throw new PageError('Page.getOffset()', err);
        }

        throw err;
      }, PageError);
  }
}
