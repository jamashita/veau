import { Superposition, Unscharferelation, UnscharferelationError } from '@jamashita/publikum-monad';
import { Entity } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';

import { AsOf } from '../../VO/AsOf/AsOf';
import { AsOfs } from '../../VO/AsOf/AsOfs';
import { Column } from '../../VO/Coordinate/Column';
import { Coordinate } from '../../VO/Coordinate/Coordinate';
import { Row } from '../../VO/Coordinate/Row';
import { StatsDisplayError } from '../../VO/Display/Error/StatsDisplayError';
import { StatsDisplay } from '../../VO/Display/StatsDisplay';
import { HeaderSizeError } from '../../VO/HeaderSize/Error/HeaderSizeError';
import { HeaderSize } from '../../VO/HeaderSize/HeaderSize';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { Language, LanguageJSON } from '../../VO/Language/Language';
import { NumericalValue } from '../../VO/NumericalValue/NumericalValue';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { Region, RegionJSON } from '../../VO/Region/Region';
import { StatsItemsError } from '../../VO/StatsItem/Error/StatsItemsError';
import { StatsItemNames } from '../../VO/StatsItem/StatsItemNames';
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
import { StatsError } from './Error/StatsError';

export type StatsJSON = Readonly<{
  outline: StatsOutlineJSON;
  language: LanguageJSON;
  region: RegionJSON;
  items: Array<StatsItemJSON>;
}>;

const REVISED_VALUE: number = 14;

export class Stats extends Entity<StatsID, Stats> {
  public readonly noun: 'Stats' = 'Stats';
  private readonly outline: StatsOutline;
  private readonly language: Language;
  private readonly region: Region;
  private readonly term: Term;
  private items: StatsItems;
  private readonly startDate: Unscharferelation<AsOf>;
  private columns?: AsOfs;

  public static of(
    outline: StatsOutline,
    language: Language,
    region: Region,
    term: Term,
    items: StatsItems,
    startDate: Unscharferelation<AsOf> = Unscharferelation.absent<AsOf>()
  ): Stats {
    return new Stats(outline, language, region, term, items, startDate);
  }

  public static ofJSON(json: StatsJSON): Superposition<Stats, StatsError> {
    return StatsOutline.ofJSON(json.outline)
      .map<Stats, StatsOutlineError | LanguageError | RegionError | TermError | StatsItemsError>(
        (outline: StatsOutline) => {
          return Language.ofJSON(json.language).map<Stats, LanguageError | RegionError | TermError | StatsItemsError>(
            (language: Language) => {
              return Region.ofJSON(json.region).map<Stats, RegionError | TermError | StatsItemsError>(
                (region: Region) => {
                  return Term.ofString(json.outline.termID).map<Stats, TermError | StatsItemsError>((term: Term) => {
                    return StatsItems.ofJSON(json.items).map<Stats, StatsItemsError>((statsItems: StatsItems) => {
                      return Stats.of(outline, language, region, term, statsItems);
                    });
                  }, StatsItemsError);
                },
                TermError,
                StatsItemsError
              );
            },
            RegionError,
            TermError,
            StatsItemsError
          );
        },
        LanguageError,
        RegionError,
        TermError,
        StatsItemsError
      )
      .recover<Stats, StatsError>(
        (err: StatsOutlineError | LanguageError | RegionError | TermError | StatsItemsError) => {
          throw new StatsError('Stats.ofJSON()', err);
        },
        StatsError
      );
  }

  public static ofObject(object: object): Superposition<Stats, StatsError> {
    if (!Stats.isJSON(object)) {
      return Superposition.dead<Stats, StatsError>(new StatsError('Stats.ofObject()'), StatsError);
    }

    return Stats.ofJSON(object);
  }

  public static isJSON(n: unknown): n is StatsJSON {
    if (!Kind.isObject<StatsJSON>(n)) {
      return false;
    }
    if (!StatsOutline.isJSON(n.outline)) {
      return false;
    }
    if (!Language.isJSON(n.language)) {
      return false;
    }
    if (!Region.isJSON(n.region)) {
      return false;
    }
    if (!StatsItems.isJSON(n.items)) {
      return false;
    }

    return true;
  }

  public static default(): Stats {
    return Stats.of(StatsOutline.default(), Language.empty(), Region.empty(), Term.DAILY, StatsItems.empty());
  }

  protected constructor(
    outline: StatsOutline,
    language: Language,
    region: Region,
    term: Term,
    items: StatsItems,
    startDate: Unscharferelation<AsOf>
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

  public getOutline(): StatsOutline {
    return this.outline;
  }

  public getItems(): StatsItems {
    return this.items;
  }

  public getStartDate(): Unscharferelation<AsOf> {
    return this.startDate;
  }

  public getIdentifier(): StatsID {
    return this.outline.getStatsID();
  }

  public getRow(row: Row): Unscharferelation<StatsItem> {
    return Unscharferelation.maybe<StatsItem>(this.items.get(row.get()));
  }

  public getColumns(): Unscharferelation<AsOfs> {
    return Unscharferelation.maybe<AsOfs>(this.columns).recover<AsOfs>(() => {
      let asOfs: AsOfs = this.items.getAsOfs();

      this.startDate.ifPresent((asOf: AsOf) => {
        asOfs = asOfs.add(asOf);
      });

      if (asOfs.isEmpty()) {
        return AsOfs.empty();
      }

      return asOfs.min().map<AsOfs>((min: AsOf) => {
        return asOfs.max().map<AsOfs>((max: AsOf) => {
          this.columns = AsOfs.duration(min, max, this.term);

          return this.columns;
        });
      });
    });
  }

  private getColumn(column: Column): Unscharferelation<AsOf> {
    return this.getColumns().map<AsOf>((asOfs: AsOfs) => {
      return asOfs.get(column.get());
    });
  }

  private recalculate(): void {
    this.columns = undefined;
    this.getColumns();
  }

  public getRowHeaderSize(): Superposition<HeaderSize, HeaderSizeError> {
    const length: number = this.items.maxNameLength();

    if (length === 0) {
      return HeaderSize.of(REVISED_VALUE);
    }

    return HeaderSize.of(length * REVISED_VALUE);
  }

  public setData(coordinate: Coordinate, value: NumericalValue): void {
    Unscharferelation.maybe<StatsItem>(this.items.get(coordinate.getRow().get())).ifPresent((item: StatsItem) => {
      this.getColumn(coordinate.getColumn()).ifPresent((asOf: AsOf) => {
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

  public getItemNames(): StatsItemNames {
    return this.items.getNames();
  }

  public hasValues(): boolean {
    return this.items.haveValues();
  }

  // TODO DELETE?
  public isDetermined(): Unscharferelation<boolean> {
    if (this.hasValues()) {
      return Unscharferelation.present<boolean>(true);
    }

    return this.startDate
      .map<boolean>(() => {
        return true;
      })
      .recover<boolean>(() => {
        return false;
      });
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
    return new Stats(this.outline, this.language, this.region, this.term, this.items.duplicate(), this.startDate);
  }

  public toJSON(): StatsJSON {
    return {
      outline: this.outline.toJSON(),
      language: this.language.toJSON(),
      region: this.region.toJSON(),
      items: this.items.toJSON()
    };
  }

  public display(): Superposition<StatsDisplay, StatsDisplayError> {
    return this.startDate
      .toSuperposition()
      .map<StatsDisplay, HeaderSizeError | UnscharferelationError>((startDate: AsOf) => {
        return this.getColumns()
          .toSuperposition()
          .map<StatsDisplay, HeaderSizeError | UnscharferelationError>((columns: AsOfs) => {
            return this.getRowHeaderSize().map<StatsDisplay, HeaderSizeError>((headerSize: HeaderSize) => {
              return StatsDisplay.of(
                this.outline,
                this.language,
                this.region,
                this.term,
                this.items,
                startDate,
                columns,
                headerSize
              );
            });
          }, HeaderSizeError);
      }, HeaderSizeError)
      .recover<StatsDisplay, StatsDisplayError>((err: HeaderSizeError | UnscharferelationError) => {
        throw new StatsDisplayError('Stats.toStatsDisplay()', err);
      }, StatsDisplayError);
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
