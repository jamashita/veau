import { ValueObject } from '@jamashita/anden-object';

const EMPTY_NAME: string = '';

export class StatsName extends ValueObject {
  private readonly name: string;

  private static readonly EMPTY: StatsName = new StatsName(EMPTY_NAME);

  public static empty(): StatsName {
    return StatsName.EMPTY;
  }

  public static of(name: string): StatsName {
    if (name === EMPTY_NAME) {
      return StatsName.empty();
    }

    return new StatsName(name);
  }

  protected constructor(name: string) {
    super();
    this.name = name;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof StatsName)) {
      return false;
    }

    return this.name === other.name;
  }

  public get(): string {
    return this.name;
  }

  public isEmpty(): boolean {
    return this === StatsName.empty();
  }

  public serialize(): string {
    return this.name;
  }
}
