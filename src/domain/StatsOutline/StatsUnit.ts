import { ValueObject } from '@jamashita/anden-object';

const EMPTY_UNIT: string = '';

export class StatsUnit extends ValueObject {
  private readonly unit: string;

  private static readonly EMPTY: StatsUnit = new StatsUnit(EMPTY_UNIT);

  public static empty(): StatsUnit {
    return StatsUnit.EMPTY;
  }

  public static of(unit: string): StatsUnit {
    if (unit === EMPTY_UNIT) {
      return StatsUnit.empty();
    }

    return new StatsUnit(unit);
  }

  protected constructor(unit: string) {
    super();
    this.unit = unit;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof StatsUnit)) {
      return false;
    }

    return this.unit === other.unit;
  }

  public get(): string {
    return this.unit;
  }

  public isEmpty(): boolean {
    return this === StatsUnit.empty();
  }

  public serialize(): string {
    return this.unit;
  }
}
