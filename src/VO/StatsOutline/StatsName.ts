import { ValueObject } from '@jamashita/publikum-object';

const EMPTY_NAME: string = '';

export class StatsName extends ValueObject<StatsName, 'StatsName'> {
  public readonly noun: 'StatsName' = 'StatsName';
  private readonly name: string;

  private static readonly EMPTY: StatsName = new StatsName(EMPTY_NAME);

  public static of(name: string): StatsName {
    if (name === EMPTY_NAME) {
      return StatsName.empty();
    }

    return new StatsName(name);
  }

  public static empty(): StatsName {
    return StatsName.EMPTY;
  }

  protected constructor(name: string) {
    super();
    this.name = name;
  }

  public equals(other: StatsName): boolean {
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

  public get(): string {
    return this.name;
  }

  public isEmpty(): boolean {
    if (this === StatsName.empty()) {
      return true;
    }

    return false;
  }
}
