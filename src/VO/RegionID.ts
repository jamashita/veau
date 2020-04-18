import { ValueObject } from '../General/Object/ValueObject';
import { Type } from '../General/Type/Type';

const EMPTY_ID: number = 0;

export class RegionID extends ValueObject {
  public readonly noun: 'RegionID' = 'RegionID';
  private readonly id: number;

  private static readonly EMPTY: RegionID = new RegionID(EMPTY_ID);

  public static of(id: number): RegionID {
    if (id === EMPTY_ID) {
      return RegionID.empty();
    }
    if (id < 0) {
      return RegionID.empty();
    }
    if (Type.isInteger(id)) {
      return new RegionID(id);
    }

    return RegionID.empty();
  }

  public static empty(): RegionID {
    return RegionID.EMPTY;
  }

  protected constructor(id: number) {
    super();
    this.id = id;
  }

  public get(): number {
    return this.id;
  }

  public isEmpty(): boolean {
    if (this === RegionID.empty()) {
      return true;
    }

    return false;
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

  protected serialize(): string {
    return `${this.id}`;
  }
}
