import { StatsValue, StatsValueJSON } from './StatsValue';

export class StatsValues {
  private values: Array<StatsValue>;

  public static of(values: Array<StatsValue>): StatsValues {
    return new StatsValues(values);
  }

  private constructor(values: Array<StatsValue>) {
    this.values = values;
  }

  public get(): Array<StatsValue> {
    return this.values;
  }

  public set(statsValue: StatsValue): void {
    this.values.push(statsValue);
  }

  public length(): number {
    return this.values.length;
  }

  public setStatsValue(statsValue: StatsValue): void {
    const newValues: Array<StatsValue> = [];
    let isSet: boolean = false;

    this.values.forEach((value: StatsValue) => {
      if (isSet) {
        newValues.push(value);
        return;
      }
      if (statsValue.getAsOf().isSame(value.getAsOf())) {
        newValues.push(StatsValue.of(statsValue.getAsOf(), statsValue.getValue()));
        isSet = true;
        return;
      }

      newValues.push(value);
    });

    if (!isSet) {
      newValues.push(statsValue);
      newValues.sort((statsValue1: StatsValue, statsValue2: StatsValue): number => {
        if (statsValue1.getAsOf().isBefore(statsValue2.getAsOf())) {
          return -1;
        }

        return 1;
      });
    }

    this.values = newValues;
  }

  public toSJON(): Array<StatsValueJSON> {
    return this.values.map<StatsValueJSON>((value: StatsValue) => {
      return value.toJSON();
    });
  }

  public toString(): string {
    return this.values.toString();
  }
}
