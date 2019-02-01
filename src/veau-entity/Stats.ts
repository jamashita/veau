import * as moment from 'moment';
import { Term } from '../veau-enum/Term';
import { RuntimeError } from '../veau-general/Error/RuntimeError';
import { Language, LanguageJSON } from '../veau-vo/Language';
import { Region, RegionJSON } from '../veau-vo/Region';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue } from '../veau-vo/StatsValue';
import { UUID } from '../veau-vo/UUID';
import { Entity } from './Entity';
import { StatsItem, StatsItemJSON } from './StatsItem';

export type StatsJSON = {
  statsID: string;
  language: LanguageJSON;
  region: RegionJSON;
  termID: number;
  name: string;
  updatedAt: string;
  items: Array<StatsItemJSON>;
};

export type StatsRow = {
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
  updatedAt: string;
};

const REVISED_VALUE: number = 12;
const TERM_FORMAT: string = 'YYYY-MM-DD';

export class Stats extends Entity<StatsID> {
  private statsID: StatsID;
  private language: Language;
  private region: Region;
  private term: Term;
  private name: string;
  private updatedAt: moment.Moment;
  private items: Array<StatsItem>;
  private startDate?: string;
  private columns?: Array<string>;

  public static default(): Stats {
    return new Stats(StatsID.of(UUID.of('')), Language.default(), Region.default(), Term.DAILY, '', moment(), []);
  }

  public constructor(statsID: StatsID, language: Language, region: Region, term: Term, name: string, updatedAt: moment.Moment, items: Array<StatsItem>, startDate?: string) {
    super();
    this.statsID = statsID;
    this.language = language;
    this.region = region;
    this.term = term;
    this.name = name;
    this.updatedAt = moment(updatedAt);
    this.items = items;
    this.startDate = startDate;
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

  public getName(): string {
    return this.name;
  }

  public getUpdatedAt(): moment.Moment {
    return moment(this.updatedAt);
  }

  public getItems(): Array<StatsItem> {
    return this.items;
  }

  public getStartDate(): string | undefined {
    return this.startDate;
  }

  public getIdentifier(): StatsID {
    return this.statsID;
  }

  public getColumns(): Array<string> {
    const {
      startDate,
      columns
    } = this;

    if (columns) {
      return columns;
    }

    const asOfs: Array<moment.Moment> = this.collectAsOf();

    if (startDate) {
      asOfs.push(moment(startDate));
    }

    if (asOfs.length === 0) {
      return [];
    }

    const minTerm: moment.Moment = moment.min(asOfs);
    const maxTerm: moment.Moment = moment.max(asOfs);
    this.columns = [];

    this.columns.push(this.previousTerm(minTerm).format(TERM_FORMAT));
    for (let term: moment.Moment = minTerm; !term.isAfter(maxTerm); term = this.nextTerm(term)) {
      this.columns.push(term.format(TERM_FORMAT));
    }
    this.columns.push(this.nextTerm(maxTerm).format(TERM_FORMAT));

    return this.columns;
  }

  private collectAsOf(): Array<moment.Moment> {
    return this.items.map<Array<moment.Moment>>((statsItem: StatsItem) => {
      return statsItem.getAsOfs();
    }).flat();
  }

  private nextTerm(term: moment.Moment): moment.Moment {
    const newTerm: moment.Moment = moment(term);
    switch (this.term) {
      case Term.DAILY: {
        return newTerm.add(1, 'days');
      }
      case Term.WEEKLY: {
        return newTerm.add(1, 'weeks');
      }
      case Term.MONTHLY: {
        return newTerm.add(1, 'months');
      }
      case Term.QUARTERLY: {
        return newTerm.add(1, 'quarters');
      }
      case Term.ANNUAL: {
        return newTerm.add(1, 'years');
      }
      default: {
        throw new RuntimeError(`UNEXPECTED VALUE: ${this.term.get()}`);
      }
    }
  }

  private previousTerm(term: moment.Moment): moment.Moment {
    const newTerm: moment.Moment = moment(term);
    switch (this.term) {
      case Term.DAILY: {
        return newTerm.subtract(1, 'days');
      }
      case Term.WEEKLY: {
        return newTerm.subtract(1, 'weeks');
      }
      case Term.MONTHLY: {
        return newTerm.subtract(1, 'months');
      }
      case Term.QUARTERLY: {
        return newTerm.subtract(1, 'quarters');
      }
      case Term.ANNUAL: {
        return newTerm.subtract(1, 'years');
      }
      default: {
        throw new RuntimeError(`UNEXPECTED VALUE: ${this.term.get()}`);
      }
    }
  }

  public getRows(): Array<string> {
    return this.items.map<string>((item: StatsItem) => {
      return `${item.getName()} (${item.getUnit()})`;
    });
  }

  public getRowHeaderSize(): number {
    const chars: Array<number> = this.getRows().map<number>((row: string) => {
      return row.length;
    });

    return Math.max(...chars) * REVISED_VALUE;
  }

  public getData(): Array<Array<string>> {
    return this.items.map<Array<string>>((statsItem: StatsItem) => {
      return statsItem.getValuesByColumn(this.getColumns());
    });
  }

  public setData(row: number, column: number, value: number): void {
    const asOfString: string = this.getColumns()[column];
    const asOf: moment.Moment = moment(asOfString);
    this.items[row].setValue(asOf, value);
  }

  public deleteData(row: number, column: number): void {
    const asOfString: string = this.getColumns()[column];
    const asOf: moment.Moment = moment(asOfString);
    this.items[row].delete(asOf);
  }

  public getChart(): Array<object> {
    const chartItems: Map<string, object> = new Map();

    this.getColumns().forEach((column: string) => {
      chartItems.set(column, {name: column});
    });

    this.items.forEach((statsItem: StatsItem) => {
      statsItem.getValues().get().forEach((statsValue: StatsValue) => {
        const line: object | undefined = chartItems.get(statsValue.getAsOfAsString());

        if (line) {
          line[statsItem.getName()] = statsValue.getValue();
        }
      });
    });

    const chart: Array<object> = [];
    chartItems.forEach((value: object, key: string) => {
      chart.push(value);
    });

    return chart;
  }

  public getItemNames(): Array<string> {
    return this.items.map<string>((statsItem: StatsItem) => {
      return statsItem.getName();
    });
  }

  public hasValues(): boolean {
    const {
      items
    } = this;

    if (items.length === 0) {
      return false;
    }

    const rowLengths: Array<number> = items.map<number>((item: StatsItem) => {
      return item.getValues().get().length;
    });

    const values: number = Math.max(...rowLengths);

    if (values === 0) {
      return false;
    }

    return true;
  }

  public isFilled(): boolean {
    const {
      language,
      region,
      name
    } = this;

    if (language.equals(Language.default())) {
      return false;
    }
    if (region.equals(Region.default())) {
      return false;
    }
    if (name === '') {
      return false;
    }

    return true;
  }

  public isValid(): boolean {
    if (!this.isFilled()) {
      return false;
    }

    const isValid: boolean = this.items.every((item: StatsItem): boolean => {
      if (item.isValid()) {
        return true;
      }

      return false;
    });

    if (isValid) {
      return true;
    }

    return false;
  }

  public replaceItem(statsItem: StatsItem, index: number): void {
    this.items = [
      ...this.items.slice(0, index),
      statsItem,
      ...this.items.slice(index + 1)
    ];
  }

  public moveItem(from: number, to: number): void {
    const min: number = Math.min(from, to);
    const max: number = Math.max(from, to);

    this.items = [
      ...this.items.slice(0, min),
      this.items[max],
      ...this.items.slice(min + 1, max),
      this.items[min],
      ...this.items.slice(max + 1)
    ];
  }

  public remove(statsItem: StatsItem): void {
    this.items = this.items.filter((item: StatsItem) => {
      if (item.equals(statsItem)) {
        return false;
      }

      return true;
    });
  }

  public copy(): Stats {
    const {
      statsID,
      language,
      region,
      term,
      name,
      updatedAt,
      items,
      startDate
    } = this;

    const newItems: Array<StatsItem> = [];

    items.forEach((item: StatsItem) => {
      newItems.push(item.copy());
    });

    return new Stats(statsID, language, region, term, name, moment(updatedAt), newItems, startDate);
  }

  public toJSON(): StatsJSON {
    const {
      statsID,
      language,
      region,
      term,
      name,
      updatedAt,
      items
    } = this;

    return {
      statsID: statsID.get().get(),
      language: language.toJSON(),
      region: region.toJSON(),
      termID: term.get(),
      name,
      updatedAt: updatedAt.utc().format('YYYY-MM-DD HH:mm:ss'),
      items: items.map<StatsItemJSON>((item: StatsItem) => {
        return item.toJSON();
      })
    };
  }

  public toString(): string {
    const {
      statsID,
      language,
      region,
      term,
      name,
      updatedAt
    } = this;

    return `${statsID.toString()} ${language.toString()} ${region.toString()} ${term.toString()} ${name} ${updatedAt.toJSON()}`;
  }
}
