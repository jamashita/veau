import { StatsError } from '../veau-error/StatsError';
import { StatsIDError } from '../veau-error/StatsIDError';
import { StatsItemsError } from '../veau-error/StatsItemsError';
import { TermError } from '../veau-error/TermError';
import { UpdatedAtError } from '../veau-error/UpdatedAtError';
import { Entity } from '../veau-general/Entity';
import { None } from '../veau-general/Optional/None';
import { Optional } from '../veau-general/Optional/Optional';
import { Some } from '../veau-general/Optional/Some';
import { Failure } from '../veau-general/Try/Failure';
import { Success } from '../veau-general/Try/Success';
import { Try } from '../veau-general/Try/Try';
import { Type } from '../veau-general/Type/Type';
import { AsOf } from '../veau-vo/AsOf';
import { AsOfs } from '../veau-vo/AsOfs';
import { Column } from '../veau-vo/Column';
import { Coordinate } from '../veau-vo/Coordinate';
import { HeaderSize } from '../veau-vo/HeaderSize';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { Language, LanguageJSON } from '../veau-vo/Language';
import { LanguageID } from '../veau-vo/LanguageID';
import { LanguageName } from '../veau-vo/LanguageName';
import { NumericalValue } from '../veau-vo/NumericalValue';
import { Region, RegionJSON } from '../veau-vo/Region';
import { RegionID } from '../veau-vo/RegionID';
import { RegionName } from '../veau-vo/RegionName';
import { Row } from '../veau-vo/Row';
import { StatsID } from '../veau-vo/StatsID';
import { StatsItemNames } from '../veau-vo/StatsItemNames';
import { StatsName } from '../veau-vo/StatsName';
import { StatsUnit } from '../veau-vo/StatsUnit';
import { StatsValue } from '../veau-vo/StatsValue';
import { Term } from '../veau-vo/Term';
import { UpdatedAt } from '../veau-vo/UpdatedAt';
import { StatsItem, StatsItemJSON } from './StatsItem';
import { StatsItems } from './StatsItems';

const REVISED_VALUE: number = 14;

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

type Chart = Readonly<{
  [key: string]: string | number;
}>;

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
  private readonly startDate: Optional<AsOf>;
  private columns: Optional<AsOfs>;

  public static of(statsID: StatsID,
    language: Language,
    region: Region,
    term: Term,
    name: StatsName,
    unit: StatsUnit,
    updatedAt: UpdatedAt,
    items: StatsItems,
    startDate: Optional<AsOf>): Stats {
    return new Stats(statsID, language, region, term, name, unit, updatedAt, items, startDate);
  }

  public static ofJSON(json: StatsJSON): Try<Stats, StatsError> {
    const {
      statsID,
      language,
      region,
      termID,
      name,
      unit,
      updatedAt,
      items
    } = json;

    return StatsID.of(statsID).match<Try<Stats, StatsError>>((id: StatsID) => {
      return Term.of(termID).match<Try<Stats, StatsError>>((term: Term) => {
        return UpdatedAt.ofString(updatedAt).match<Try<Stats, StatsError>>((at: UpdatedAt) => {
          return StatsItems.ofJSON(items).match<Try<Stats, StatsError>>((statsItems: StatsItems) => {
            const stats: Stats = Stats.of(
              id,
              Language.ofJSON(language),
              Region.ofJSON(region),
              term,
              StatsName.of(name),
              StatsUnit.of(unit),
              at,
              statsItems,
              None.of<AsOf>()
            );

            return Success.of<Stats, StatsError>(stats);
          }, (err: StatsItemsError) => {
            return Failure.of<Stats, StatsError>(new StatsError(err.message));
          });
        }, (err: UpdatedAtError) => {
          return Failure.of<Stats, StatsError>(new StatsError(err.message));
        });
      }, (err: TermError) => {
        return Failure.of<Stats, StatsError>(new StatsError(err.message));
      });
    }, (err: StatsIDError) => {
      return Failure.of<Stats, StatsError>(new StatsError(err.message));
    });
  }

  public static ofRow(row: StatsRow, statsItems: StatsItems): Try<Stats, StatsError> {
    const {
      statsID,
      languageID,
      languageName,
      languageEnglishName,
      iso639,
      regionID,
      regionName,
      iso3166,
      termID,
      name,
      unit,
      updatedAt
    } = row;

    const language: Language = Language.of(LanguageID.of(languageID), LanguageName.of(languageName), LanguageName.of(languageEnglishName), ISO639.of(iso639));
    const region: Region = Region.of(RegionID.of(regionID), RegionName.of(regionName), ISO3166.of(iso3166));

    return StatsID.of(statsID).match<Try<Stats, StatsError>>((id: StatsID) => {
      return Term.of(termID).match<Try<Stats, StatsError>>((term: Term) => {
        return UpdatedAt.ofString(updatedAt).match<Try<Stats, StatsError>>((at: UpdatedAt) => {
          const stats: Stats = Stats.of(
            id,
            language,
            region,
            term,
            StatsName.of(name),
            StatsUnit.of(unit),
            at,
            statsItems,
            None.of<AsOf>()
          );

          return Success.of<Stats, StatsError>(stats);
        }, (err: UpdatedAtError) => {
          return Failure.of<Stats, StatsError>(new StatsError(err.message));
        });
      }, (err: TermError) => {
        return Failure.of<Stats, StatsError>(new StatsError(err.message));
      });
    }, (err: StatsIDError) => {
      return Failure.of<Stats, StatsError>(new StatsError(err.message));
    });
  }

  public static isJSON(n: unknown): n is StatsJSON {
    if (!Type.isPlainObject(n)) {
      return false;
    }

    const {
      statsID,
      language,
      region,
      termID,
      name,
      unit,
      updatedAt,
      items
    } = n;

    if (!Type.isString(statsID)) {
      return false;
    }
    if (!Language.isJSON(language)) {
      return false;
    }
    if (!Region.isJSON(region)) {
      return false;
    }
    if (!Type.isInteger(termID)) {
      return false;
    }
    if (!Type.isString(name)) {
      return false;
    }
    if (!Type.isString(unit)) {
      return false;
    }
    if (!Type.isString(updatedAt)) {
      return false;
    }
    if (!StatsItems.isJSON(items)) {
      return false;
    }

    return true;
  }

  public static default(): Stats {
    return Stats.of(
      StatsID.generate(),
      Language.default(),
      Region.default(),
      Term.DAILY,
      StatsName.default(),
      StatsUnit.default(),
      UpdatedAt.now(),
      StatsItems.empty(),
      None.of<AsOf>()
    );
  }

  private constructor(statsID: StatsID,
    language: Language,
    region: Region,
    term: Term,
    name: StatsName,
    unit: StatsUnit,
    updatedAt: UpdatedAt,
    items: StatsItems,
    startDate: Optional<AsOf>) {
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
    this.columns = None.of<AsOfs>();
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

  public getStartDate(): Optional<AsOf> {
    return this.startDate;
  }

  public getIdentifier(): StatsID {
    return this.statsID;
  }

  public getRow(row: Row): Optional<StatsItem> {
    return this.items.get(row.get());
  }

  public getColumns(): AsOfs {
    const {
      startDate,
      columns
    } = this;

    if (columns.isPresent()) {
      return columns.get();
    }

    let asOfs: AsOfs = this.getAsOfs();

    if (startDate.isPresent()) {
      asOfs = asOfs.add(startDate.get());
    }

    if (asOfs.isEmpty()) {
      return AsOfs.empty();
    }

    const minTerm: AsOf = asOfs.min().get();
    const maxTerm: AsOf = asOfs.max().get();
    asOfs = AsOfs.empty();

    asOfs = asOfs.add(minTerm.previous(this.term));
    for (let asOf: AsOf = minTerm; !asOf.isAfter(maxTerm); asOf = asOf.next(this.term)) {
      asOfs = asOfs.add(asOf);
    }
    asOfs = asOfs.add(maxTerm.next(this.term));

    this.columns = Some.of<AsOfs>(asOfs);

    return asOfs;
  }

  public getColumn(column: Column): Optional<AsOf> {
    return this.getColumns().get(column.get());
  }

  private recalculateColumns(): void {
    this.columns = None.of<AsOfs>();
    this.getColumns();
  }

  private getAsOfs(): AsOfs {
    return this.items.getAsOfs();
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

  public getChart(): Array<object> {
    const chartItems: Map<string, Chart> = new Map<string, Chart>();

    this.getColumns().forEach((column: AsOf) => {
      const asOfString: string = column.toString();
      chartItems.set(asOfString, {name: asOfString});
    });

    this.items.forEach((statsItem: StatsItem) => {
      statsItem.getValues().forEach((statsValue: StatsValue) => {
        const line: Chart | undefined = chartItems.get(statsValue.getAsOf().toString());

        if (line !== undefined) {
          line[statsItem.getName().get()] = statsValue.getValue().get();
        }
      });
    });

    const chart: Array<object> = [];
    chartItems.forEach((value: object) => {
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
    const {
      language,
      region,
      name,
      unit
    } = this;

    if (language.equals(Language.default())) {
      return false;
    }
    if (region.equals(Region.default())) {
      return false;
    }
    if (name.equals(StatsName.default())) {
      return false;
    }
    if (unit.equals(StatsUnit.default())) {
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

    const {
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt,
      items,
      startDate
    } = this;

    if (!statsID.equals(other.getStatsID())) {
      return false;
    }
    if (!language.equals(other.getLanguage())) {
      return false;
    }
    if (!region.equals(other.getRegion())) {
      return false;
    }
    if (term !== other.getTerm()) {
      return false;
    }
    if (!name.equals(other.getName())) {
      return false;
    }
    if (!unit.equals(other.getUnit())) {
      return false;
    }
    if (!updatedAt.equals(other.getUpdatedAt())) {
      return false;
    }
    if (!items.areSame(other.getItems())) {
      return false;
    }
    if (startDate.isPresent() && other.getStartDate().isPresent()) {
      if (startDate.get().equals(other.getStartDate().get())) {
        return true;
      }

      return false;
    }
    if (!startDate.isPresent() && !other.getStartDate().isPresent()) {
      return true;
    }

    return false;
  }

  public copy(): Stats {
    const {
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt,
      items,
      startDate
    } = this;

    return new Stats(statsID, language, region, term, name, unit, updatedAt, items.copy(), startDate);
  }

  public toJSON(): StatsJSON {
    const {
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt,
      items
    } = this;

    return {
      statsID: statsID.get(),
      language: language.toJSON(),
      region: region.toJSON(),
      termID: term.getID(),
      name: name.get(),
      unit: unit.get(),
      updatedAt: updatedAt.toString(),
      items: items.toJSON()
    };
  }

  public toString(): string {
    const {
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt
    } = this;

    return `${statsID.toString()} ${language.toString()} ${region.toString()} ${term.toString()} ${name.toString()} ${unit.toString()} ${updatedAt.toString()}`;
  }
}
