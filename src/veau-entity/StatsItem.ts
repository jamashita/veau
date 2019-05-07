import * as moment from 'moment';
import { StatsValues } from '@/veau-collection/StatsValues';
import { Random } from '@/veau-general/Random';
import { StatsItemID } from '@/veau-vo/StatsItemID';
import { StatsValue, StatsValueJSON } from '@/veau-vo/StatsValue';
import { UUID } from '@/veau-vo/UUID';
import { Entity } from './Entity';

export type StatsItemJSON = {
  statsItemID: string;
  name: string;
  values: Array<StatsValueJSON>;
};

export type StatsItemRow = {
  statsItemID: string;
  name: string;
};

export class StatsItem extends Entity<StatsItemID> {
  private statsItemID: StatsItemID;
  private name: string;
  private values: StatsValues;

  public static default(): StatsItem {
    const uuid: UUID = UUID.of(Random.v4());
    return new StatsItem(StatsItemID.of(uuid), '', new StatsValues([]));
  }

  public constructor(statsItemID: StatsItemID, name: string, values: StatsValues) {
    super();
    this.statsItemID = statsItemID;
    this.name = name;
    this.values = values;
  }

  public getStatsItemID(): StatsItemID {
    return this.statsItemID;
  }

  public getName(): string {
    return this.name;
  }

  public getValues(): StatsValues {
    return this.values;
  }

  public getIdentifier(): StatsItemID {
    return this.statsItemID;
  }

  public getAsOfs(): Array<moment.Moment> {
    const asOfs: Array<moment.Moment> = [];

    this.values.forEach((statsValue: StatsValue) => {
      asOfs.push(statsValue.getAsOf());
    });

    return asOfs;
  }

  public getValuesByColumn(column: Array<string>): Array<string> {
    const valuesByColumn: Array<string> = [];

    column.forEach((term: string) => {
      let alreadyInput: boolean = false;

      this.values.forEach((statsValue: StatsValue) => {
        if (alreadyInput) {
          return;
        }
        if (term === statsValue.getAsOfAsString()) {
          valuesByColumn.push(statsValue.getValue().toString());
          alreadyInput = true;
          return;
        }
      });
      if (!alreadyInput) {
        valuesByColumn.push('');
      }
    });

    return valuesByColumn;
  }

  public setValue(asOf: moment.Moment, value: number): void {
    const statsValue: StatsValue = StatsValue.of(asOf, value);
    this.values = this.values.set(statsValue);
  }

  public delete(asOf: moment.Moment): void {
    this.values = this.values.delete(asOf);
  }

  public isFilled(): boolean {
    const {
      name
    } = this;

    if (name === '') {
      return false;
    }

    return true;
  }

  public isValid(): boolean {
    return this.isFilled();
  }

  public copy(): StatsItem {
    const {
      statsItemID,
      name,
      values
    } = this;

    return new StatsItem(statsItemID, name, values.copy());
  }

  public toJSON(): StatsItemJSON {
    const {
      statsItemID,
      name,
      values
    } = this;

    return {
      statsItemID: statsItemID.get().get(),
      name,
      values: values.toJSON()
    };
  }

  public toString(): string {
    const {
      statsItemID,
      name
    } = this;

    return `${statsItemID.toString()} ${name}`;
  }
}
