import { ValueObject } from '../General/ValueObject';

const DEFAULT_ID: number = 0;

export class RegionID extends ValueObject {
  public readonly noun: 'RegionID' = 'RegionID';
  private readonly id: number;

  private static readonly DEFAULT: RegionID = RegionID.of(DEFAULT_ID);

  public static of(id: number): RegionID {
    return new RegionID(id);
  }

  public static default(): RegionID {
    return RegionID.DEFAULT;
  }

  protected constructor(id: number) {
    super();
    this.id = id;
  }

  public get(): number {
    return this.id;
  }

  public equals(other: RegionID): boolean {
    if (this === other) {
      return true;
    }
    if (this.id === other.id) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return `${this.id}`;
  }
}
