import { ValueObject } from '@jamashita/publikum-object';

export class PageProvider extends ValueObject<PageProvider> {
  public readonly noun: 'PageProvider' = 'PageProvider';
  private readonly open: boolean;

  private static readonly OPEN: PageProvider = new PageProvider(true);
  private static readonly CLOSE: PageProvider = new PageProvider(false);

  public static of(open: boolean): PageProvider {
    if (open) {
      return PageProvider.open();
    }

    return PageProvider.close();
  }

  public static open(): PageProvider {
    return PageProvider.OPEN;
  }

  public static close(): PageProvider {
    return PageProvider.CLOSE;
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
