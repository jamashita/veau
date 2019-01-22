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

const TERM_FORMAT: string = 'YYYY-MM-DD';

export class Stats extends Entity<StatsID> {
  private statsID: StatsID;
  private language: Language;
  private region: Region;
  private term: Term;
  private name: string;
  private updatedAt: moment.Moment;
  private items: Array<StatsItem>;
  private column?: Array<string>;

  public static default(): Stats {
    return new Stats(StatsID.of(UUID.of('')), Language.default(), Region.default(), Term.DAILY, '', moment.utc(), []);
  }

  public constructor(statsID: StatsID, language: Language, region: Region, term: Term, name: string, updatedAt: moment.Moment, items: Array<StatsItem>) {
    super();
    this.statsID = statsID;
    this.language = language;
    this.region = region;
    this.term = term;
    this.name = name;
    this.updatedAt = updatedAt;
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

  public getStats(): Array<StatsItem> {
    return this.items;
  }

  public getIdentifier(): StatsID {
    return this.statsID;
  }

  public getColumn(): Array<string> {
    if (this.column) {
      return this.column;
    }

    const asOfs: Array<moment.Moment> = this.collectAsOf();
    const length: number = asOfs.length;

    if (length === 0) {
      return [];
    }

    const minTerm: moment.Moment = moment.min(asOfs);
    const maxTerm: moment.Moment = moment.max(asOfs);
    const column: Array<string> = [];

    for (let term: moment.Moment = minTerm; !term.isAfter(maxTerm); term = this.nextTerm(term)) {
      column.push(term.format(TERM_FORMAT));
    }

    this.column = column;
    return column;
  }

  private collectAsOf(): Array<moment.Moment> {
    return this.items.map<Array<moment.Moment>>((statsItem: StatsItem) => {
      return statsItem.getAsOfs();
    }).flat();
  }

  private nextTerm(term: moment.Moment): moment.Moment {
    switch (this.term) {
      case Term.DAILY:
      default: {
        return term.add(1, 'days');
      }
      case Term.WEEKLY: {
        return term.add(1, 'weeks');
      }
      case Term.MONTHLY: {
        return term.add(1, 'months');
      }
      case Term.ANNUAL: {
        return term.add(1, 'years');
      }
    }
  }

  public getRow(): Array<string> {
    return this.items.map<string>((item: StatsItem) => {
      return item.getName();
    });
  }

  public getDataMatrix(): Array<Array<string>> {
    const column: Array<string> = this.getColumn();

    return this.items.map<Array<string>>((statsItem: StatsItem, index: number) => {
      return statsItem.getValuesByColumn(column);
    });
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
