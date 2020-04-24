import { Alive, Dead, Kind, Superposition, ValueObject } from 'publikum';
import { PageError } from '../Error/PageError';
import { Limit } from './Limit';
import { Offset } from './Offset';

const MIN_PAGE: number = 1;

export class Page extends ValueObject {
  public readonly noun: 'Page' = 'Page';
  private readonly page: number;

  private static readonly MIN: Page = new Page(MIN_PAGE);

  public static of(page: number): Superposition<Page, PageError> {
    if (page <= 0) {
      return Dead.of<Page, PageError>(new PageError(`ILLEGAL PAGE SPECIFIED ${page}`));
    }
    if (page === MIN_PAGE) {
      return Alive.of<Page, PageError>(Page.MIN);
    }
    if (Kind.isInteger(page)) {
      return Alive.of<Page, PageError>(new Page(page));
    }

    return Dead.of<Page, PageError>(new PageError('ILLEGAL PAGE SPECIFIED'));
  }

  public static min(): Page {
    return Page.MIN;
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

  public serialize(): string {
    return `${this.page}`;
  }
}
