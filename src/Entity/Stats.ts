import { Absent, Alive, Ambiguous, Dead, Entity, Kind, Quantum, Superposition } from 'publikum';
import { LanguageIDError } from '../Error/LanguageIDError';
import { RegionIDError } from '../Error/RegionIDError';
import { StatsError } from '../Error/StatsError';
import { StatsIDError } from '../Error/StatsIDError';
import { StatsItemsError } from '../Error/StatsItemsError';
import { TermError } from '../Error/TermError';
import { UpdatedAtError } from '../Error/UpdatedAtError';
import { AsOf } from '../VO/AsOf';
import { AsOfs } from '../VO/AsOfs';
import { Column } from '../VO/Column';
import { Coordinate } from '../VO/Coordinate';
import { HeaderSize } from '../VO/HeaderSize';
import { Language } from '../VO/Language';
import { LanguageID } from '../VO/LanguageID';
import { NumericalValue } from '../VO/NumericalValue';
import { Region } from '../VO/Region';
import { RegionID } from '../VO/RegionID';
import { Row } from '../VO/Row';
import { StatsID } from '../VO/StatsID';
import { StatsItemNames } from '../VO/StatsItemNames';
import { StatsName } from '../VO/StatsName';
import { StatsUnit } from '../VO/StatsUnit';
import { StatsValue } from '../VO/StatsValue';
import { Term } from '../VO/Term';
import { UpdatedAt } from '../VO/UpdatedAt';
import { StatsItem, StatsItemJSON } from './StatsItem';
import { StatsItems } from './StatsItems';

export type StatsJSON = Readonly<{
  statsID: string;
  languageID: string;
  regionID: string;
  termID: number;
  name: string;
  unit: string;
  updatedAt: string;
  items: Array<StatsItemJSON>;
}>;
export type StatsRow = Readonly<{
  statsID: string;
  languageID: string;
  regionID: string;
  termID: number;
  name: string;
  unit: string;
  updatedAt: string;
}>;
type Chart = Record<string, string | number>;

const REVISED_VALUE: number = 14;

export class Stats extends Entity<StatsID> {
  public readonly noun: 'Stats' = 'Stats';
  private readonly statsID: StatsID;
  private readonly languageID: LanguageID;
  private readonly regionID: RegionID;
  private readonly term: Term;
  private readonly name: StatsName;
  private readonly unit: StatsUnit;
  private readonly updatedAt: UpdatedAt;
  private items: StatsItems;
  private readonly startDate: Quantum<AsOf>;
  private columns?: AsOfs;

  public static of(
    statsID: StatsID,
    languageID: LanguageID,
    regionID: RegionID,
    term: Term,
    name: StatsName,
    unit: StatsUnit,
    updatedAt: UpdatedAt,
    items: StatsItems,
    startDate: Quantum<AsOf> = Absent.of<AsOf>()
  ): Stats {
    return new Stats(
      statsID,
      languageID,
      regionID,
      term,
      name,
      unit,
      updatedAt,
      items,
      startDate
    );
  }

  public static ofJSON(json: StatsJSON): Superposition<Stats, StatsError> {
    return StatsID.ofString(json.statsID).match<Stats, StatsError>((statsID: StatsID) => {
      return LanguageID.ofString(json.languageID).match((languageID: LanguageID) => {
        return RegionID.ofString(json.regionID).match((regionID: RegionID) => {
          return Term.of(json.termID).match<Stats, StatsError>((term: Term) => {
            return UpdatedAt.ofString(json.updatedAt).match<Stats, StatsError>((updatedAt: UpdatedAt) => {
              return StatsItems.ofJSON(json.items).match<Stats, StatsError>((statsItems: StatsItems) => {
                return Alive.of<Stats, StatsError>(
                  Stats.of(
                    statsID,
                    languageID,
                    regionID,
                    term,
                    StatsName.of(json.name),
                    StatsUnit.of(json.unit),
                    updatedAt,
                    statsItems
                  )
                );
              }, (err: StatsItemsError) => {
                return Dead.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
              });
            }, (err: UpdatedAtError) => {
              return Dead.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
            });
          }, (err: TermError) => {
            return Dead.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
          });
        }, (err: RegionIDError) => {
          return Dead.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
        });
      }, (err: LanguageIDError) => {
        return Dead.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
      });
    }, (err: StatsIDError) => {
      return Dead.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
    });
  }

  public static ofRow(row: StatsRow, statsItems: StatsItems): Superposition<Stats, StatsError> {
    return StatsID.ofString(row.statsID).match<Stats, StatsError>((statsID: StatsID) => {
      return LanguageID.ofString(row.languageID).match((languageID: LanguageID) => {
        return RegionID.ofString(row.regionID).match((regionID: RegionID) => {
          return Term.of(row.termID).match<Stats, StatsError>((term: Term) => {
            return UpdatedAt.ofString(row.updatedAt).match<Stats, StatsError>((updatedAt: UpdatedAt) => {
              return Alive.of<Stats, StatsError>(
                Stats.of(
                  statsID,
                  languageID,
                  regionID,
                  term,
                  StatsName.of(row.name),
                  StatsUnit.of(row.unit),
                  updatedAt,
                  statsItems
                )
              );
            }, (err: UpdatedAtError) => {
              return Dead.of<Stats, StatsError>(new StatsError('Stats.ofRow()', err));
            });
          }, (err: TermError) => {
            return Dead.of<Stats, StatsError>(new StatsError('Stats.ofRow()', err));
          });
        }, (err: RegionIDError) => {
          return Dead.of<Stats, StatsError>(new StatsError('Stats.ofRow()', err));
        });
      }, (err: LanguageIDError) => {
        return Dead.of<Stats, StatsError>(new StatsError('Stats.ofRow()', err));
      });
    }, (err: StatsIDError) => {
      return Dead.of<Stats, StatsError>(new StatsError('Stats.ofRow()', err));
    });
  }

  public static isJSON(n: unknown): n is StatsJSON {
    if (!Kind.isPlainObject(n)) {
      return false;
    }
    if (!Kind.isString(n.statsID)) {
      return false;
    }
    if (!Language.isJSON(n.language)) {
      return false;
    }
    if (!Region.isJSON(n.region)) {
      return false;
    }
    if (!Kind.isInteger(n.termID)) {
      return false;
    }
    if (!Kind.isString(n.name)) {
      return false;
    }
    if (!Kind.isString(n.unit)) {
      return false;
    }
    if (!Kind.isString(n.updatedAt)) {
      return false;
    }
    if (!StatsItems.isJSON(n.items)) {
      return false;
    }

    return true;
  }

  public static default(): Stats {
    return Stats.of(
      StatsID.generate(),
      LanguageID.empty(),
      RegionID.empty(),
      Term.DAILY,
      StatsName.empty(),
      StatsUnit.empty(),
      UpdatedAt.now(),
      StatsItems.empty()
    );
  }

  protected constructor(
    statsID: StatsID,
    languageID: LanguageID,
    regionID: RegionID,
    term: Term,
    name: StatsName,
    unit: StatsUnit,
    updatedAt: UpdatedAt,
    items: StatsItems,
    startDate: Quantum<AsOf>
  ) {
    super();
    this.statsID = statsID;
    this.languageID = languageID;
    this.regionID = regionID;
    this.term = term;
    this.name = name;
    this.unit = unit;
    this.updatedAt = updatedAt;
    this.items = items;
    this.startDate = startDate;
  }

  public getStatsID(): StatsID {
    return this.statsID;
  }

  public getLanguageID(): LanguageID {
    return this.languageID;
  }

  public getRegionID(): RegionID {
    return this.regionID;
  }

  public getTerm(): Term {
    return this.term;
  }

  public getName(): StatsName {
    return this.name;
  }

  public getUnit(): StatsUnit {
    return this.unit;
  }

  public getUpdatedAt(): UpdatedAt {
    return this.updatedAt;
  }

  public getItems(): StatsItems {
    return this.items;
  }

  public getStartDate(): Quantum<AsOf> {
    return this.startDate;
  }

  public getIdentifier(): StatsID {
    return this.statsID;
  }

  public getRow(row: Row): Quantum<StatsItem> {
    return this.items.get(row.get());
  }

  public getColumns(): AsOfs {
    if (this.columns !== undefined) {
      return this.columns;
    }

    let asOfs: AsOfs = this.items.getAsOfs();

    this.startDate.ifPresent((asOf: AsOf) => {
      asOfs = asOfs.add(asOf);
    });

    if (asOfs.isEmpty()) {
      return AsOfs.empty();
    }

    const min: AsOf = asOfs.min().get();
    const max: AsOf = asOfs.max().get();

    this.columns = AsOfs.duration(min, max, this.term);

    return this.columns;
  }

  public getColumn(column: Column): Quantum<AsOf> {
    return this.getColumns().get(column.get());
  }

  private recalculate(): void {
    this.columns = undefined;
    this.getColumns();
  }

  public getRowHeaders(): StatsItemNames {
    return this.items.getNames();
  }

  public getRowHeaderSize(): HeaderSize {
    const length: number = this.items.maxNameLength();

    if (length === 0) {
      return HeaderSize.of(REVISED_VALUE).get();
    }

    return HeaderSize.of(length * REVISED_VALUE).get();
  }

  public getData(): Array<Array<string>> {
    const columns: AsOfs = this.getColumns();

    return this.items.map<Array<string>>((item: StatsItem) => {
      return item.getValuesByColumn(columns).row();
    });
  }

  public setData(coordinate: Coordinate, value: NumericalValue): void {
    this.items.get(coordinate.getRow().get()).ifPresent((item: StatsItem) => {
      this.getColumns().get(coordinate.getColumn().get()).ifPresent((asOf: AsOf) => {
        const statsValue: StatsValue = StatsValue.of(asOf, value);

        item.set(statsValue);
        this.recalculate();
      });
    });
  }

  public deleteData(coordinate: Coordinate): void {
    this.getColumn(coordinate.getColumn()).ifPresent((asOf: AsOf) => {
      this.getRow(coordinate.getRow()).ifPresent((item: StatsItem) => {
        item.delete(asOf);
        this.recalculate();
      });
    });
  }

  public getChart(): Array<Chart> {
    const chartItems: Map<string, Chart> = new Map<string, Chart>();

    this.getColumns().forEach((column: AsOf) => {
      const asOfString: string = column.toString();
      chartItems.set(asOfString, {
        name: asOfString
      });
    });

    this.items.forEach((statsItem: StatsItem) => {
      statsItem.getValues().forEach((statsValue: StatsValue) => {
        const line: Ambiguous<Chart> = chartItems.get(statsValue.getAsOf().toString());

        if (line !== undefined) {
          line[statsItem.getName().get()] = statsValue.getValue().get();
        }
      });
    });

    const chart: Array<Chart> = [];
    chartItems.forEach((value: Chart) => {
      chart.push(value);
    });

    return chart;
  }

  public getItemNames(): StatsItemNames {
    return this.items.getNames();
  }

  public hasValues(): boolean {
    return this.items.haveValues();
  }

  public isDetermined(): boolean {
    if (this.hasValues()) {
      return true;
    }
    if (this.startDate.isPresent()) {
      return true;
    }

    return false;
  }

  public isFilled(): boolean {
    if (this.languageID.isEmpty()) {
      return false;
    }
    if (this.regionID.isEmpty()) {
      return false;
    }
    if (this.name.isEmpty()) {
      return false;
    }
    if (this.unit.isEmpty()) {
      return false;
    }

    return true;
  }

  public isValid(): boolean {
    if (!this.isFilled()) {
      return false;
    }
    if (!this.items.areValid()) {
      return false;
    }

    return true;
  }

  public replaceItem(statsItem: StatsItem, to: Row): void {
    this.items = this.items.replace(statsItem, to);
  }

  public moveItem(from: Column, to: Column): void {
    this.items = this.items.move(from, to);
  }

  public removeItem(statsItem: StatsItem): void {
    this.items = this.items.remove(statsItem);
  }

  public isSame(other: Stats): boolean {
    if (this === other) {
      return true;
    }
    if (!this.statsID.equals(other.statsID)) {
      return false;
    }
    if (!this.languageID.equals(other.languageID)) {
      return false;
    }
    if (!this.regionID.equals(other.regionID)) {
      return false;
    }
    if (!this.term.equals(other.term)) {
      return false;
    }
    if (!this.name.equals(other.name)) {
      return false;
    }
    if (!this.unit.equals(other.unit)) {
      return false;
    }
    if (!this.updatedAt.equals(other.updatedAt)) {
      return false;
    }
    if (!this.items.areSame(other.items)) {
      return false;
    }

    return true;
  }

  public duplicate(): Stats {
    return new Stats(
      this.statsID,
      this.languageID,
      this.regionID,
      this.term,
      this.name,
      this.unit,
      this.updatedAt,
      this.items.duplicate(),
      this.startDate
    );
  }

  public toJSON(): StatsJSON {
    return {
      statsID: this.statsID.get().get(),
      languageID: this.languageID.get().get(),
      regionID: this.regionID.get().get(),
      termID: this.term.getID(),
      name: this.name.get(),
      unit: this.unit.get(),
      updatedAt: this.updatedAt.toString(),
      items: this.items.toJSON()
    };
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.statsID.toString());
    properties.push(this.languageID.toString());
    properties.push(this.regionID.toString());
    properties.push(this.term.toString());
    properties.push(this.name.toString());
    properties.push(this.unit.toString());
    properties.push(this.updatedAt.toString());

    return properties.join(' ');
  }
}
