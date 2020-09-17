import { Entity } from '@jamashita/publikum-object';
import { Kind, Nullable } from '@jamashita/publikum-type';
import { AsOf } from '../../VO/AsOf/AsOf';
import { AsOfs } from '../../VO/AsOf/AsOfs';
import { Column } from '../../VO/Coordinate/Column';
import { Coordinate } from '../../VO/Coordinate/Coordinate';
import { Row } from '../../VO/Coordinate/Row';
import { HeaderSize } from '../../VO/HeaderSize/HeaderSize';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { Language, LanguageJSON } from '../../VO/Language/Language';
import { NumericalValue } from '../../VO/NumericalValue/NumericalValue';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { Region, RegionJSON } from '../../VO/Region/Region';
import { StatsItemError } from '../../VO/StatsItem/Error/StatsItemError';
import { StatsError } from '../../VO/StatsOutline/Error/StatsError';
import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsName } from '../../VO/StatsOutline/StatsName';
import { StatsOutline, StatsOutlineJSON } from '../../VO/StatsOutline/StatsOutline';
import { StatsUnit } from '../../VO/StatsOutline/StatsUnit';
import { UpdatedAt } from '../../VO/StatsOutline/UpdatedAt';
import { StatsValue } from '../../VO/StatsValue/StatsValue';
import { TermError } from '../../VO/Term/Error/TermError';
import { Term } from '../../VO/Term/Term';
import { StatsItem, StatsItemJSON } from '../StatsItem/StatsItem';
import { StatsItems } from '../StatsItem/StatsItems';

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

  public static default(): Stats {
    return Stats.of(
      StatsOutline.default(),
      Language.empty(),
      Region.empty(),
      Term.DAILY,
      StatsItems.empty()
    );
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

  public getIdentifier(): StatsID {
    return this.outline.getStatsID();
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

  public toJSON(): StatsJSON {
    return {
      outline: this.outline.toJSON(),
      language: this.language.toJSON(),
      region: this.region.toJSON(),
      items: this.items.toJSON()
    };
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.outline.toString());
    properties.push(this.language.toString());
    properties.push(this.region.toString());
    properties.push(this.term.toString());

    return properties.join(' ');
  }

  public getStatsID(): StatsID {
    return this.outline.getStatsID();
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
    return this.outline.getName();
  }

  public getUnit(): StatsUnit {
    return this.outline.getUnit();
  }

  public getUpdatedAt(): UpdatedAt {
    return this.outline.getUpdatedAt();
  }

  public getOutline(): StatsOutline {
    return this.outline;
  }

  public getItems(): StatsItems {
    return this.items;
  }

  public getStartDate(): Nullable<AsOf> {
    return this.startDate;
  }

  public getRow(row: Row): Nullable<StatsItem> {
    return this.items.get(row.get());
  }

  public getColumns(): Nullable<AsOfs> {
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
      return null;
    }

    const max: Nullable<AsOf> = asOfs.max();

    if (Kind.isNull(max)) {
      return null;
    }

    this.columns = AsOfs.duration(min, max, this.term);

    return this.columns;
  }

  private getColumn(column: Column): Nullable<AsOf> {
    const columns: Nullable<AsOfs> = this.getColumns();

    if (Kind.isNull(columns)) {
      return null;
    }

    return columns.get(column.get());
  }

  private recalculate(): void {
    this.columns = null;

    this.getColumns();
  }

  public getRowHeaderSize(): HeaderSize {
    const length: number = this.items.maxNameLength();

    if (length === 0) {
      return HeaderSize.of(1);
    }

    return HeaderSize.of(length);
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

  public replaceItem(statsItem: StatsItem, to: Row): void {
    this.items.replace(statsItem, to);
  }

  public moveItem(from: Column, to: Column): void {
    this.items.move(from, to);
  }

  public removeItem(statsItem: StatsItem): void {
    this.items.remove(statsItem);
  }
}
