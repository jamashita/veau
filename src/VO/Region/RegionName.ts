import { ValueObject } from 'publikum';

const EMPTY_NAME: string = '';

export class RegionName extends ValueObject {
  public readonly noun: 'RegionName' = 'RegionName';
  private readonly name: string;

  private static readonly EMPTY: RegionName = new RegionName(EMPTY_NAME);

  public static of(name: string): RegionName {
    if (name === EMPTY_NAME) {
      return RegionName.empty();
    }

    return new RegionName(name);
  }

  public static empty(): RegionName {
    return RegionName.EMPTY;
  }

  protected constructor(name: string) {
    super();
    this.name = name;
  }

  public get(): string {
    return this.name;
  }

  public isEmpty(): boolean {
    if (this === RegionName.empty()) {
      return true;
    }

    return false;
  }

  public equals(other: RegionName): boolean {
    if (this === other) {
      return true;
    }
    if (this.name === other.name) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.name;
  }
}
