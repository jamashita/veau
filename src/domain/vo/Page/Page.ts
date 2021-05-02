import { ValueObject } from '@jamashita/anden-object';
import { Kind } from '@jamashita/anden-type';
import { PageError } from './Error/PageError';
import { Limit } from './Limit';
import { Offset } from './Offset';

const MIN_PAGE: number = 1;

export class Page extends ValueObject<'Page'> {
  public readonly noun: 'Page' = 'Page';
  private readonly page: number;

  private static readonly MIN: Page = new Page(MIN_PAGE);

  public static min(): Page {
    return Page.MIN;
  }

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

    throw new PageError(`ILLEGAL PAGE SPECIFIED: ${page}`);
  }

  protected constructor(page: number) {
    super();
    this.page = page;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Page)) {
      return false;
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
