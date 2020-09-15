import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';
import { PageError } from './Error/PageError';
import { Limit } from './Limit';
import { Offset } from './Offset';

const MIN_PAGE: number = 1;

export class Page extends ValueObject<Page, 'Page'> {
  public readonly noun: 'Page' = 'Page';
  private readonly page: number;
  private static readonly MIN: Page = new Page(MIN_PAGE);

  public static of(page: number): Page {
    if (page <= 0) {
      throw new PageError(`ILLEGAL PAGE SPECIFIED ${page}`);
    }
    if (page === MIN_PAGE) {
      return Page.MIN;
    }
    if (Kind.isInteger(page)) {
      return new Page(page);
    }

    throw new PageError(`ILLEGAL PAGE SPECIFIED: ${Kind.notate(page)}`);
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

  public getLimit(): Limit {
    return Limit.default();
  }

  public getOffset(): Offset {
    const offset: number = (this.page - 1) * this.getLimit().get();

    return Offset.of(offset);
  }
}
