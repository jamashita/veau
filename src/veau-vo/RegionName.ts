import { ValueObject } from './ValueObject';

export class RegionName extends  ValueObject {
  private name: string;

  public static of(name: string): RegionName {
    return new RegionName(name);
  }

  public static default(): RegionName {
    return RegionName.of('');
  }

  private constructor(name: string) {
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
