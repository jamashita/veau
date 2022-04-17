import { ValueObject } from '@jamashita/anden-object';

const EMPTY_NAME: string = '';

export class RegionName extends ValueObject {
  private readonly name: string;

  private static readonly EMPTY: RegionName = new RegionName(EMPTY_NAME);

  public static empty(): RegionName {
    return RegionName.EMPTY;
  }

  public static of(name: string): RegionName {
    if (name === EMPTY_NAME) {
      return RegionName.empty();
    }

    return new RegionName(name);
  }

  protected constructor(name: string) {
    super();
    this.name = name;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof RegionName)) {
      return false;
    }

    return this.name === other.name;
  }

  public serialize(): string {
    return this.name;
  }

  public get(): string {
    return this.name;
  }

  public isEmpty(): boolean {
    return this === RegionName.empty();
  }
}
