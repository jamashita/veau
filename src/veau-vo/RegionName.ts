import { ValueObject } from '../veau-general/ValueObject';

const DEFAULT_NAME: string = '';

export class RegionName extends ValueObject {
  public readonly noun: 'RegionName' = 'RegionName';
  private readonly name: string;

  private static readonly DEFAULT: RegionName = RegionName.of(DEFAULT_NAME);

  public static of(name: string): RegionName {
    return new RegionName(name);
  }

  public static default(): RegionName {
    return RegionName.DEFAULT;
  }

  protected constructor(name: string) {
    super();
    this.name = name;
  }

  public get(): string {
    return this.name;
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

  public toString(): string {
    return this.name;
  }
}
