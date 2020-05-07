import { ValueObject } from 'publikum';

export class PageProvider extends ValueObject {
  public readonly noun: 'PageProvider' = 'PageProvider';
  private readonly open: boolean;

  public static of(open: boolean): PageProvider {
    return new PageProvider(open);
  }

  public static open(): PageProvider {
    return new PageProvider(true);
  }

  public static close(): PageProvider {
    return new PageProvider(false);
  }

  protected constructor(open: boolean) {
    super();
    this.open = open;
  }

  public get(): boolean {
    return this.open;
  }

  public equals(other: PageProvider): boolean {
    if (this === other) {
      return true;
    }
    if (this.open === other.open) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return `${this.open}`;
  }
}
