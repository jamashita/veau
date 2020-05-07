import { Absent, Alive, Ambiguous, Dead, Entity, Kind, Quantum, Superposition } from 'publikum';
import { LanguageError } from '../Error/LanguageError';
import { RegionError } from '../Error/RegionError';
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
import { Language, LanguageJSON } from '../VO/Language';
import { NumericalValue } from '../VO/NumericalValue';
import { Region, RegionJSON } from '../VO/Region';
import { Row } from '../VO/Row';
import { StatsID } from '../VO/StatsID';
import { StatsItemNames } from '../VO/StatsItemNames';
import { StatsName } from '../VO/StatsName';
import { StatsOutline, StatsOutlineJSON } from '../VO/StatsOutline';
import { StatsUnit } from '../VO/StatsUnit';
import { StatsValue } from '../VO/StatsValue';
import { Term } from '../VO/Term';
import { UpdatedAt } from '../VO/UpdatedAt';
import { StatsItem, StatsItemJSON } from './StatsItem';
import { StatsItems } from './StatsItems';

export type StatsJSON = Readonly<{
  outline: StatsOutlineJSON;
  language: LanguageJSON;
  region: RegionJSON;
  items: Array<StatsItemJSON>;
}>;
type Chart = Record<string, string | number>;

const REVISED_VALUE: number = 14;

export class Stats extends Entity<StatsID> {
  public readonly noun: 'Stats' = 'Stats';
  private readonly outline: StatsOutline;
  private readonly language: Language;
  private readonly region: Region;
  private readonly term: Term;
  private items: StatsItems;
  private readonly startDate: Quantum<AsOf>;
  private columns?: AsOfs;

  public static of(
    outline: StatsOutline,
    language: Language,
    region: Region,
    term: Term,
    items: StatsItems,
    startDate: Quantum<AsOf> = Absent.of<AsOf>()
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

  public static ofJSON(json: StatsJSON): Superposition<Stats, StatsError> {
    // TODO
    StatsOutline.ofJSON(json);
    return StatsID.ofString(json.statsID).match<Stats, StatsError>((statsID: StatsID) => {
      return Language.ofJSON(json.language).match((language: Language) => {
        return Region.ofJSON(json.region).match((region: Region) => {
          return Term.ofString(json.termID).match<Stats, StatsError>((term: Term) => {
            return UpdatedAt.ofString(json.updatedAt).match<Stats, StatsError>((updatedAt: UpdatedAt) => {
              return StatsItems.ofJSON(json.items).match<Stats, StatsError>((statsItems: StatsItems) => {
                return Alive.of<Stats, StatsError>(
                  Stats.of(
                    statsID,
                    language,
                    region,
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
        }, (err: RegionError) => {
          return Dead.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
        });
      }, (err: LanguageError) => {
        return Dead.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
      });
    }, (err: StatsIDError) => {
      return Dead.of<Stats, StatsError>(new StatsError('Stats.ofJSON()', err));
    });
  }

  public static isJSON(n: unknown): n is StatsJSON {
    if (!Kind.isPlainObject(n)) {
      return false;
    }
    if (!Kind.isString(n.statsID)) {
      return false;
    }
    if (!Kind.isString(n.termID)) {
      return false;
    }
    if (!Language.isJSON(n.language)) {
      return false;
    }
    if (!Region.isJSON(n.region)) {
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
    outline: StatsOutline,
    language: Language,
    region: Region,
    term: Term,
    items: StatsItems,
    startDate: Quantum<AsOf>
  ) {
    super();
    this.outline = outline;
    this.language = language;
    this.region = region;
    this.term = term;
    this.items = items;
    this.startDate = startDate;
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

  public getItems(): StatsItems {
    return this.items;
  }

  public getStartDate(): Quantum<AsOf> {
    return this.startDate;
  }

  public getIdentifier(): StatsID {
    return this.outline.getStatsID();
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
    if (!this.items.areSame(other.items)) {
      return false;
    }

    return true;
  }

  public duplicate(): Stats {
    return new Stats(
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
}
