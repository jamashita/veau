import * as moment from 'moment';
import { Term } from '../veau-enum/Term';
import { RuntimeError } from '../veau-error/RuntimeError';
import { UUID } from '../veau-general/UUID';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue } from '../veau-vo/StatsValue';
import { StatsItems } from './collection/StatsItems';
import { Entity } from './Entity';
import { Language, LanguageJSON } from './Language';
import { Region, RegionJSON } from './Region';
import { StatsItem, StatsItemJSON } from './StatsItem';

const REVISED_VALUE: number = 14;
const TERM_FORMAT: string = 'YYYY-MM-DD';

export type StatsJSON = {
  statsID: string;
  language: LanguageJSON;
  region: RegionJSON;
  termID: number;
  name: string;
  unit: string;
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
  unit: string;
  updatedAt: string;
};

type Chart = {
  [key: string]: string | number;
};

export class Stats extends Entity<StatsID> {
  private statsID: StatsID;
  private language: Language;
  private region: Region;
  private term: Term;
  private name: string;
  private unit: string;
  private updatedAt: moment.Moment;
  private items: StatsItems;
  private startDate?: string;
  private columns?: Array<string>;

  public static default(): Stats {
    return new Stats(StatsID.of(UUID.v4()), Language.default(), Region.default(), Term.DAILY, '', '', moment(), new StatsItems([]));
  }

  public constructor(statsID: StatsID, language: Language, region: Region, term: Term, name: string, unit: string, updatedAt: moment.Moment, items: StatsItems, startDate?: string) {
    super();
    this.statsID = statsID;
    this.language = language;
    this.region = region;
    this.term = term;
    this.name = name;
    this.unit = unit;
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

  public getUnit(): string {
    return this.unit;
  }

  public getUpdatedAt(): moment.Moment {
    return moment(this.updatedAt);
  }

  public getUpdatedAtAsString(): string {
    return this.updatedAt.format(TERM_FORMAT);
  }

  public getItems(): StatsItems {
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

    const asOfs: Array<moment.Moment> = this.getAsOfs();

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

  private recalculateColumns(): void {
    this.columns = undefined;
    this.getColumns();
  }

  private getAsOfs(): Array<moment.Moment> {
    return this.items.getAsOfs();
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
        throw new RuntimeError(`UNEXPECTED VALUE: ${this.term.getID()}`);
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
        throw new RuntimeError(`UNEXPECTED VALUE: ${this.term.getID()}`);
      }
    }
  }

  public getRows(): Array<string> {
    return this.getItemNames();
  }

  public getRowHeaderSize(): number {
    const chars: Array<number> = this.getRows().map<number>((row: string): number => {
      return row.length;
    });

    return Math.max(...chars) * REVISED_VALUE;
  }

  public getData(): Array<Array<string>> {
    const data: Array<Array<string>> = [];

    this.items.forEach((statsItem: StatsItem): void => {
      data.push(statsItem.getValuesByColumn(this.getColumns()));
    });

    return data;
  }

  public setData(row: number, column: number, value: number): void {
    const asOfString: string = this.getColumns()[column];
    const asOf: moment.Moment = moment(asOfString);
    this.items.get(row).setValue(asOf, value);
    this.recalculateColumns();
  }

  public deleteData(row: number, column: number): void {
    const asOfString: string = this.getColumns()[column];
    const asOf: moment.Moment = moment(asOfString);
    this.items.get(row).delete(asOf);
    this.recalculateColumns();
  }

  public getChart(): Array<object> {
    const chartItems: Map<string, Chart> = new Map<string, Chart>();

    this.getColumns().forEach((column: string): void => {
      chartItems.set(column, {name: column});
    });

    this.items.forEach((statsItem: StatsItem): void => {
      statsItem.getValues().forEach((statsValue: StatsValue): void => {
        const line: Chart | undefined = chartItems.get(statsValue.getAsOfAsString());

        if (line) {
          line[statsItem.getName()] = statsValue.getValue();
        }
      });
    });

    const chart: Array<object> = [];
    chartItems.forEach((value: object): void => {
      chart.push(value);
    });

    return chart;
  }

  public getItemNames(): Array<string> {
    return this.items.getNames();
  }

  public hasValues(): boolean {
    return this.items.haveValues();
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
    if (name === '') {
      return false;
    }
    if (unit === '') {
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

  public replaceItem(statsItem: StatsItem, to: number): void {
    this.items = this.items.replace(statsItem, to);
  }

  public moveItem(from: number, to: number): void {
    this.items = this.items.move(from, to);
  }

  public removeItem(statsItem: StatsItem): void {
    this.items = this.items.remove(statsItem);
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

    return new Stats(statsID, language, region, term, name, unit, moment(updatedAt), items.copy(), startDate);
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
      name,
      unit,
      updatedAt: updatedAt.utc().format('YYYY-MM-DD HH:mm:ss'),
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

    return `${statsID.toString()} ${language.toString()} ${region.toString()} ${term.toString()} ${name} ${unit} ${updatedAt.toJSON()}`;
  }
}
