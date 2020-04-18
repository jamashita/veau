import { StatsError } from '../Error/StatsError';
import { StatsIDError } from '../Error/StatsIDError';
import { StatsItemsError } from '../Error/StatsItemsError';
import { TermError } from '../Error/TermError';
import { UpdatedAtError } from '../Error/UpdatedAtError';
import { Entity } from '../General/Entity';
import { Absent } from '../General/Quantum/Absent';
import { Present } from '../General/Quantum/Present';
import { Quantum } from '../General/Quantum/Quantum';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';
import { Type } from '../General/Type/Type';
import { Ambiguous } from '../General/Type/Value';
import { AsOf } from '../VO/AsOf';
import { AsOfs } from '../VO/AsOfs';
import { Column } from '../VO/Column';
import { Coordinate } from '../VO/Coordinate';
import { HeaderSize } from '../VO/HeaderSize';
import { Language, LanguageJSON } from '../VO/Language';
import { NumericalValue } from '../VO/NumericalValue';
import { Region, RegionJSON } from '../VO/Region';
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
  language: LanguageJSON;
  region: RegionJSON;
  termID: number;
  name: string;
  unit: string;
  updatedAt: string;
  items: Array<StatsItemJSON>;
}>;
export type StatsRow = Readonly<{
  statsID: string;
  languageID: number;
  languageName: string;
  languageEnglishName: string;
  iso639: string;
  regionID: number;
  regionName: string;
  iso3166: string;
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
  private readonly language: Language;
  private readonly region: Region;
  private readonly term: Term;
  private readonly name: StatsName;
  private readonly unit: StatsUnit;
  private readonly updatedAt: UpdatedAt;
  private items: StatsItems;
  private readonly startDate: Quantum<AsOf>;
  private columns: Quantum<AsOfs>;

  public static of(
    statsID: StatsID,
    language: Language,
    region: Region,
    term: Term,
    name: StatsName,
    unit: StatsUnit,
    updatedAt: UpdatedAt,
    items: StatsItems,
    startDate: Quantum<AsOf> = Absent.of<AsOf>()
  ): Stats {
    return new Stats(
      statsID,
      language,
      region,
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
      return Term.of(json.termID).match<Stats, StatsError>((term: Term) => {
        return UpdatedAt.ofString(json.updatedAt).match<Stats, StatsError>((updatedAt: UpdatedAt) => {
          return StatsItems.ofJSON(json.items).match<Stats, StatsError>((statsItems: StatsItems) => {
            const stats: Stats = Stats.of(
              statsID,
              Language.ofJSON(json.language),
              Region.ofJSON(json.region),
              term,
              StatsName.of(json.name),
              StatsUnit.of(json.unit),
              updatedAt,
              statsItems
            );

            return Success.of<Stats, StatsError>(stats);
          }, (err: StatsItemsError) => {
            return Failure.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
          });
        }, (err: UpdatedAtError) => {
          return Failure.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
        });
      }, (err: TermError) => {
        return Failure.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
      });
    }, (err: StatsIDError) => {
      return Failure.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
    });
  }

  public static ofRow(row: StatsRow, statsItems: StatsItems): Superposition<Stats, StatsError> {
    return StatsID.ofString(row.statsID).match<Stats, StatsError>((statsID: StatsID) => {
      return Term.of(row.termID).match<Stats, StatsError>((term: Term) => {
        return UpdatedAt.ofString(row.updatedAt).match<Stats, StatsError>((updatedAt: UpdatedAt) => {
          const language: Language = Language.ofRow({
            languageID: row.languageID,
            name: row.languageName,
            englishName: row.languageEnglishName,
            iso639: row.iso639
          });
          const region: Region = Region.ofRow({
            regionID: row.regionID,
            name: row.regionName,
            iso3166: row.iso3166
          });

          const stats: Stats = Stats.of(
            statsID,
            language,
            region,
            term,
            StatsName.of(row.name),
            StatsUnit.of(row.unit),
            updatedAt,
            statsItems
          );

          return Success.of<Stats, StatsError>(stats);
        }, (err: UpdatedAtError) => {
          return Failure.of<Stats, StatsError>(new StatsError('Stats.ofRow()', err));
        });
      }, (err: TermError) => {
        return Failure.of<Stats, StatsError>(new StatsError('Stats.ofRow()', err));
      });
    }, (err: StatsIDError) => {
      return Failure.of<Stats, StatsError>(new StatsError('Stats.ofRow()', err));
    });
  }

  public static isJSON(n: unknown): n is StatsJSON {
    if (!Type.isPlainObject(n)) {
      return false;
    }
    if (!Type.isString(n.statsID)) {
      return false;
    }
    if (!Language.isJSON(n.language)) {
      return false;
    }
    if (!Region.isJSON(n.region)) {
      return false;
    }
    if (!Type.isInteger(n.termID)) {
      return false;
    }
    if (!Type.isString(n.name)) {
      return false;
    }
    if (!Type.isString(n.unit)) {
      return false;
    }
    if (!Type.isString(n.updatedAt)) {
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
      Language.empty(),
      Region.empty(),
      Term.DAILY,
      StatsName.empty(),
      StatsUnit.empty(),
      UpdatedAt.now(),
      StatsItems.empty()
    );
  }

  protected constructor(
    statsID: StatsID,
    language: Language,
    region: Region,
    term: Term,
    name: StatsName,
    unit: StatsUnit,
    updatedAt: UpdatedAt,
    items: StatsItems,
    startDate: Quantum<AsOf>
  ) {
    super();
    this.statsID = statsID;
    this.language = language;
    this.region = region;
    this.term = term;
    this.name = name;
    this.unit = unit;
    this.updatedAt = updatedAt;
    this.items = items;
    this.startDate = startDate;
    this.columns = Absent.of<AsOfs>();
  }

  public getStatsID(): StatsID {
    return this.statsID;
  }

  public getLanguage(): Language {
    return this.language;
  }

  public getRegion(): Region {
    return this.region;
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
    if (this.columns.isPresent()) {
      return this.columns.get();
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

    const newColumns: AsOfs = AsOfs.duration(min, max, this.term);
    this.columns = Present.of<AsOfs>(newColumns);

    return newColumns;
  }

  public getColumn(column: Column): Quantum<AsOf> {
    return this.getColumns().get(column.get());
  }

  private recalculateColumns(): void {
    this.columns = Absent.of<AsOfs>();
    this.getColumns();
  }

  public getRowHeaders(): StatsItemNames {
    return this.items.getNames();
  }

  public getRowHeaderSize(): HeaderSize {
    const length: number = this.items.maxNameLength();

    if (length === 0) {
      return HeaderSize.of(1 * REVISED_VALUE).get();
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
        const statsValue: StatsValue = StatsValue.of(item.getStatsItemID(), asOf, value);

        item.setValue(statsValue);
        this.recalculateColumns();
      });
    });
  }

  public deleteData(coordinate: Coordinate): void {
    this.getColumn(coordinate.getColumn()).ifPresent((asOf: AsOf) => {
      this.getRow(coordinate.getRow()).ifPresent((item: StatsItem) => {
        item.delete(asOf);
        this.recalculateColumns();
      });
    });
  }

  public getChart(): Array<Chart> {
    const chartItems: Map<string, Chart> = new Map<string, Chart>();

    this.getColumns().forEach((column: AsOf) => {
      const asOfString: string = column.toString();
      chartItems.set(asOfString, {name: asOfString});
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
    if (this.language.equals(Language.empty())) {
      return false;
    }
    if (this.region.equals(Region.empty())) {
      return false;
    }
    if (this.name.equals(StatsName.empty())) {
      return false;
    }
    if (this.unit.equals(StatsUnit.empty())) {
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
    if (!this.language.equals(other.language)) {
      return false;
    }
    if (!this.region.equals(other.region)) {
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

  public copy(): Stats {
    return new Stats(
      this.statsID,
      this.language,
      this.region,
      this.term,
      this.name,
      this.unit,
      this.updatedAt,
      this.items.copy(),
      this.startDate
    );
  }

  public toJSON(): StatsJSON {
    return {
      statsID: this.statsID.get().get(),
      language: this.language.toJSON(),
      region: this.region.toJSON(),
      termID: this.term.getID(),
      name: this.name.get(),
      unit: this.unit.get(),
      updatedAt: this.updatedAt.toString(),
      items: this.items.toJSON()
    };
  }

  public toString(): string {
    const properties: Array<string> = [];

    properties.push(this.statsID.toString());
    properties.push(this.language.toString());
    properties.push(this.region.toString());
    properties.push(this.term.toString());
    properties.push(this.name.toString());
    properties.push(this.unit.toString());
    properties.push(this.updatedAt.toString());

    return properties.join(' ');
  }
}
