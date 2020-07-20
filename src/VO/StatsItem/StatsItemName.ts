import { ValueObject } from '@jamashita/publikum-object';

const EMPTY_NAME: string = '';

export class StatsItemName extends ValueObject<StatsItemName, 'StatsItemName'> {
  public readonly noun: 'StatsItemName' = 'StatsItemName';
  private readonly name: string;
  private static readonly EMPTY: StatsItemName = new StatsItemName(EMPTY_NAME);

  public static of(name: string): StatsItemName {
    if (name === EMPTY_NAME) {
      return StatsItemName.empty();
    }

    return new StatsItemName(name);
  }

  public static empty(): StatsItemName {
    return StatsItemName.EMPTY;
  }

  protected constructor(name: string) {
    super();
    this.name = name;
  }

  public equals(other: StatsItemName): boolean {
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

  public length(): number {
    return this.name.length;
  }

  public isEmpty(): boolean {
    if (this === StatsItemName.empty()) {
      return true;
    }

    return false;
  }
}
