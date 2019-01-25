import * as moment from 'moment';
import { Language, LanguageJSON } from '../veau-vo/Language';
import { Region, RegionJSON } from '../veau-vo/Region';
import { StatsID } from '../veau-vo/StatsID';
import { Term } from '../veau-vo/Term';
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

  public static default(): Stats {
    return new Stats(StatsID.of(UUID.of('')), Language.default(), Region.default(), Term.DAILY, '', moment(), []);
  }

  public constructor(statsID: StatsID, language: Language, region: Region, term: Term, name: string, updatedAt: moment.Moment, items: Array<StatsItem>) {
    super();
    this.statsID = statsID;
    this.language = language;
    this.region = region;
    this.term = term;
    this.name = name;
    this.updatedAt = moment(updatedAt);
    this.items = items;
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

  public getIdentifier(): StatsID {
    return this.statsID;
  }

  public getColumn(): Array<string> {
    const asOfs: Array<moment.Moment> = this.collectAsOf();
    const length: number = asOfs.length;

    if (length === 0) {
      return [];
    }

    const minTerm: moment.Moment = moment.min(asOfs);
    const maxTerm: moment.Moment = moment.max(asOfs);
    const column: Array<string> = [];

    column.push(this.previousTerm(minTerm).format(TERM_FORMAT));
    for (let term: moment.Moment = minTerm; !term.isAfter(maxTerm); term = this.nextTerm(term)) {
      column.push(term.format(TERM_FORMAT));
    }
    column.push(this.nextTerm(maxTerm).format(TERM_FORMAT));

    return column;
  }

  private collectAsOf(): Array<moment.Moment> {
    return this.items.map<Array<moment.Moment>>((statsItem: StatsItem) => {
      return statsItem.getAsOfs();
    }).flat();
  }

  private nextTerm(term: moment.Moment): moment.Moment {
    const newTerm: moment.Moment = moment(term);
    switch (this.term) {
      case Term.DAILY:
      default: {
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
    }
  }

  private previousTerm(term: moment.Moment): moment.Moment {
    const newTerm: moment.Moment = moment(term);
    switch (this.term) {
      case Term.DAILY:
      default: {
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
    }
  }

  public getRow(): Array<string> {
    return this.items.map<string>((item: StatsItem) => {
      return `${item.getName()} (${item.getUnit()})`;
    });
  }

  public getRowHeaderSize(): number {
    const chars: Array<number> = this.getRow().map<number>((row: string) => {
      return row.length;
    });

    return Math.max(...chars) * REVISED_VALUE;
  }

  public getData(): Array<Array<string>> {
    const column: Array<string> = this.getColumn();

    return this.items.map<Array<string>>((statsItem: StatsItem, index: number) => {
      return statsItem.getValuesByColumn(column);
    });
  }

  public setData(row: number, column: number, value: number): void {
    const asOfString: string = this.getColumn()[column];
    const asOf: moment.Moment = moment(asOfString);
    this.items[row].setValue(asOf, value);
  }

  public deleteData(row: number, column: number): void {
    const asOfString: string = this.getColumn()[column];
    const asOf: moment.Moment = moment(asOfString);
    this.items[row].delete(asOf);
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

  public copy(): Stats {
    const {
      statsID,
      language,
      region,
      term,
      name,
      updatedAt,
      items
    } = this;

    const newItems: Array<StatsItem> = [];

    items.forEach((item: StatsItem) => {
      newItems.push(item.copy());
    });

    return new Stats(statsID.copy(), language.copy(), region.copy(), term.copy(), name, moment(updatedAt), newItems);
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
