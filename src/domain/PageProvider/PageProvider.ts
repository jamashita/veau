import { ValueObject } from '@jamashita/anden-object';

export class PageProvider extends ValueObject {
  private readonly open: boolean;

  private static readonly OPEN: PageProvider = new PageProvider(true);
  private static readonly CLOSE: PageProvider = new PageProvider(false);

  public static close(): PageProvider {
    return PageProvider.CLOSE;
  }

  public static of(open: boolean): PageProvider {
    if (open) {
      return PageProvider.open();
    }

    return PageProvider.close();
  }

  public static open(): PageProvider {
    return PageProvider.OPEN;
  }

  protected constructor(open: boolean) {
    super();
    this.open = open;
  }

  public equals(other: unknown): boolean {
    return this === other;
  }

  public get(): boolean {
    return this.open;
  }

  public serialize(): string {
    return `${this.open}`;
  }
}
