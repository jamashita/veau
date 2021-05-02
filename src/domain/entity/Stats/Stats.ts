import { Entity } from '@jamashita/anden-object';
import { Ambiguous, Kind, Nullable } from '@jamashita/anden-type';
import { AsOf } from '../../vo/AsOf/AsOf';
import { AsOfs } from '../../vo/AsOf/AsOfs';
import { Column } from '../../vo/Coordinate/Column';
import { Coordinate } from '../../vo/Coordinate/Coordinate';
import { Row } from '../../vo/Coordinate/Row';
import { HeaderSize } from '../../vo/HeaderSize/HeaderSize';
import { LanguageError } from '../../vo/Language/Error/LanguageError';
import { Language, LanguageJSON } from '../../vo/Language/Language';
import { NumericalValue } from '../../vo/NumericalValue/NumericalValue';
import { RegionError } from '../../vo/Region/Error/RegionError';
import { Region, RegionJSON } from '../../vo/Region/Region';
import { StatsItemError } from '../../vo/StatsItem/Error/StatsItemError';
import { StatsItemNames } from '../../vo/StatsItem/StatsItemNames';
import { StatsError } from '../../vo/StatsOutline/Error/StatsError';
import { StatsOutlineError } from '../../vo/StatsOutline/Error/StatsOutlineError';
import { StatsID } from '../../vo/StatsOutline/StatsID';
import { StatsName } from '../../vo/StatsOutline/StatsName';
import { StatsOutline, StatsOutlineJSON } from '../../vo/StatsOutline/StatsOutline';
import { StatsUnit } from '../../vo/StatsOutline/StatsUnit';
import { UpdatedAt } from '../../vo/StatsOutline/UpdatedAt';
import { StatsValue } from '../../vo/StatsValue/StatsValue';
import { TermError } from '../../vo/Term/Error/TermError';
import { Term } from '../../vo/Term/Term';
import { StatsItem, StatsItemJSON } from '../StatsItem/StatsItem';
import { StatsItems } from '../StatsItem/StatsItems';

type Chart = { [key: string]: number | string; };
export type StatsJSON = Readonly<{
  outline: StatsOutlineJSON;
  language: LanguageJSON;
  region: RegionJSON;
  items: Array<StatsItemJSON>;
}>;

export class Stats extends Entity<StatsID, Stats> {
  public readonly noun: 'Stats' = 'Stats';
  private readonly outline: StatsOutline;
  private readonly language: Language;
  private readonly region: Region;
  private readonly term: Term;
  private readonly items: StatsItems;
  private readonly startDate: Nullable<AsOf>;
  private columns: Nullable<AsOfs>;

  public static default(): Stats {
    return Stats.of(
      StatsOutline.default(),
      Language.empty(),
      Region.empty(),
      Term.DAILY,
      StatsItems.empty()
    );
  }

  public static of(
    outline: StatsOutline,
    language: Language,
    region: Region,
    term: Term,
    items: StatsItems,
    startDate: Nullable<AsOf> = null
  ): Stats {
    return new Stats(
      outline,
      language,
      region,
      term,
      items,
      startDate
    );
  }

  public static ofJSON(json: StatsJSON): Stats {
    try {
      return Stats.of(
        StatsOutline.ofJSON(json.outline),
        Language.ofJSON(json.language),
        Region.ofJSON(json.region),
        Term.ofString(json.outline.termID),
        StatsItems.ofJSON(json.items)
      );
    }
    catch (err: unknown) {
      if (err instanceof StatsOutlineError || err instanceof LanguageError || err instanceof RegionError || err instanceof TermError || err instanceof StatsItemError) {
        throw new StatsError('Stats.ofJSON()', err);
      }

      throw err;
    }
  }

  public static validate(n: unknown): n is StatsJSON {
    if (!Kind.isObject<StatsJSON>(n)) {
      return false;
    }
    if (!StatsOutline.validate(n.outline)) {
      return false;
    }
    if (!Language.validate(n.language)) {
      return false;
    }
    if (!Region.validate(n.region)) {
      return false;
    }
    if (!StatsItems.validate(n.items)) {
      return false;
    }

    return true;
  }

  protected constructor(
    outline: StatsOutline,
    language: Language,
    region: Region,
    term: Term,
    items: StatsItems,
    startDate: Nullable<AsOf>
  ) {
    super();
    this.outline = outline;
    this.language = language;
    this.region = region;
    this.term = term;
    this.items = items;
    this.startDate = startDate;
    this.columns = null;
  }

  public duplicate(): Stats {
    return Stats.of(
      this.outline,
      this.language,
      this.region,
      this.term,
      this.items.duplicate(),
      this.startDate
    );
  }

  public getIdentifier(): StatsID {
    return this.outline.getStatsID();
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.outline.toString());
    properties.push(this.language.toString());
    properties.push(this.region.toString());
    properties.push(this.term.toString());

    return properties.join(' ');
  }

  public deleteData(coordinate: Coordinate): void {
    const asOf: Nullable<AsOf> = this.getColumn(coordinate.getColumn());

    if (Kind.isNull(asOf)) {
      return;
    }

    const item: Nullable<StatsItem> = this.getRow(coordinate.getRow());

    if (Kind.isNull(item)) {
      return;
    }

    item.delete(asOf);
    this.recalculate();
  }

  public getChart(): Array<{ [key: string]: number | string; }> {
    const chartItems: Map<string, Chart> = new Map<string, Chart>();

    this.getColumns().forEach((column: AsOf) => {
      const asOf: string = column.toString();

      chartItems.set(asOf, {
        name: asOf
      });
    });
    this.items.forEach((statsItem: StatsItem) => {
      statsItem.getValues().forEach((statsValue: StatsValue) => {
        const line: Ambiguous<Chart> = chartItems.get(statsValue.getAsOf().toString());

        if (!Kind.isUndefined(line)) {
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

  private getColumn(column: Column): Nullable<AsOf> {
    const columns: Nullable<AsOfs> = this.getColumns();

    if (Kind.isNull(columns)) {
      return null;
    }

    return columns.get(column.get());
  }

  public getColumns(): AsOfs {
    if (!Kind.isNull(this.columns)) {
      return this.columns;
    }

    let asOfs: AsOfs = this.items.getAsOfs();

    if (!Kind.isNull(this.startDate)) {
      asOfs = asOfs.add(this.startDate);
    }
    if (asOfs.isEmpty()) {
      return AsOfs.empty();
    }

    const min: Nullable<AsOf> = asOfs.min();

    if (Kind.isNull(min)) {
      return AsOfs.empty();
    }

    const max: Nullable<AsOf> = asOfs.max();

    if (Kind.isNull(max)) {
      return AsOfs.empty();
    }

    this.columns = AsOfs.duration(min, max, this.term);

    return this.columns;
  }

  public getData(): Array<Array<string>> {
    return this.items.map<Array<string>>((item: StatsItem) => {
      return item.getValuesByColumn(this.getColumns()).row();
    }).toArray();
  }

  public getItemNames(): StatsItemNames {
    return this.items.getNames();
  }

  public getItems(): StatsItems {
    return this.items;
  }

  public getLanguage(): Language {
    return this.language;
  }

  public getName(): StatsName {
    return this.outline.getName();
  }

  public getOutline(): StatsOutline {
    return this.outline;
  }

  public getRegion(): Region {
    return this.region;
  }

  public getRow(row: Row): Nullable<StatsItem> {
    return this.items.get(row.get());
  }

  public getRowHeaderSize(): HeaderSize {
    const length: number = this.items.maxNameLength();

    if (length === 0) {
      return HeaderSize.of(1);
    }

    return HeaderSize.of(length);
  }

  public getRowHeaders(): StatsItemNames {
    return this.items.getNames();
  }

  public getStartDate(): Nullable<AsOf> {
    return this.startDate;
  }

  public getStatsID(): StatsID {
    return this.outline.getStatsID();
  }

  public getTerm(): Term {
    return this.term;
  }

  public getUnit(): StatsUnit {
    return this.outline.getUnit();
  }

  public getUpdatedAt(): UpdatedAt {
    return this.outline.getUpdatedAt();
  }

  public isDetermined(): boolean {
    return this.items.haveValues();
  }

  public isFilled(): boolean {
    if (this.language.isEmpty()) {
      return false;
    }
    if (this.region.isEmpty()) {
      return false;
    }
    if (this.outline.getName().isEmpty()) {
      return false;
    }
    if (this.outline.getUnit().isEmpty()) {
      return false;
    }

    return true;
  }

  public isValid(): boolean {
    if (!this.isFilled()) {
      return false;
    }

    return this.items.areFilled();
  }

  public moveItem(from: Column, to: Column): void {
    this.items.move(from, to);
  }

  private recalculate(): void {
    this.columns = null;

    this.getColumns();
  }

  public removeItem(statsItem: StatsItem): void {
    this.items.remove(statsItem);
  }

  public replaceItem(statsItem: StatsItem, to: Row): void {
    this.items.replace(statsItem, to);
  }

  public same(other: Stats): boolean {
    if (this === other) {
      return true;
    }
    if (!this.outline.equals(other.outline)) {
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
    if (!this.items.equals(other.items)) {
      return false;
    }

    return true;
  }

  public setData(coordinate: Coordinate, value: NumericalValue): void {
    const item: Nullable<StatsItem> = this.items.get(coordinate.getRow().get());

    if (Kind.isNull(item)) {
      return;
    }

    const asOf: Nullable<AsOf> = this.getColumn(coordinate.getColumn());

    if (Kind.isNull(asOf)) {
      return;
    }

    const statsValue: StatsValue = StatsValue.of(asOf, value);

    item.set(statsValue);
    this.recalculate();
  }

  public toJSON(): StatsJSON {
    return {
      outline: this.outline.toJSON(),
      language: this.language.toJSON(),
      region: this.region.toJSON(),
      items: this.items.toJSON()
    };
  }
}
