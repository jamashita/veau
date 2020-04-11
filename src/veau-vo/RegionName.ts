import { ValueObject } from '../veau-general/ValueObject';

export class RegionName extends ValueObject {
  public readonly noun: 'RegionName' = 'RegionName';
  private readonly name: string;

  public static of(name: string): RegionName {
    return new RegionName(name);
  }

  public static default(): RegionName {
    return RegionName.of('');
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
    if (this.name === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.name;
  }
}
