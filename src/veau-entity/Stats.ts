import * as moment from 'moment';
import { Language, LanguageJSON } from '../veau-vo/Language';
import { Region, RegionJSON } from '../veau-vo/Region';
import { StatsID } from '../veau-vo/StatsID';
import { StatsValue } from '../veau-vo/StatsValue';
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
    return this.updatedAt;
  }

  public getStats(): Array<StatsItem> {
    return this.items;
  }

  public getIdentifier(): StatsID {
    return this.statsID;
  }

  public getColumnHeader(): Array<string> {
    const asOfs: Array<moment.Moment> = this.collectAsOf();
    const length: number = asOfs.length;

    if (length === 0) {
      return [];
    }

    const minTerm: moment.Moment = asOfs[0];
    const maxTerm: moment.Moment = asOfs[length - 1];

    return this.enumerateTerm(minTerm, maxTerm);
  }

  private collectAsOf(): Array<moment.Moment> {
    const asOfs: Array<moment.Moment> = [];

    this.items.forEach((statsItem: StatsItem) => {
      statsItem.getValues().forEach((statsValue: StatsValue) => {
        asOfs.push(statsValue.getAsOf());
      });
    });

    return asOfs.sort((asOf1: moment.Moment, asOf2: moment.Moment) => {
      if (asOf1.isAfter(asOf2)) {
        return 1;
      }

      return -1;
    });
  }

  private enumerateTerm(minTerm: moment.Moment, maxTerm: moment.Moment): Array<string> {
    let term: moment.Moment = minTerm;
    const terms: Array<string> = [];

    switch (this.term) {
      case Term.DAILY:
      default: {
        while (true) {
          if (term.isAfter(maxTerm)) {
            return terms;
          }

          terms.push(term.format(TERM_FORMAT));
          term = term.add(1, 'day');
        }
      }
      case Term.WEEKLY: {
        while (true) {
          if (term.isAfter(maxTerm)) {
            return terms;
          }

          terms.push(term.format(TERM_FORMAT));
          term = term.add(1, 'week');
        }
      }
      case Term.MONTHLY: {
        while (true) {
          if (term.isAfter(maxTerm)) {
            return terms;
          }

          terms.push(term.format(TERM_FORMAT));
          term = term.add(1, 'month');
        }
      }
      case Term.ANNUAL: {
        while (true) {
          if (term.isAfter(maxTerm)) {
            return terms;
          }

          terms.push(term.format(TERM_FORMAT));
          term = term.add(1, 'year');
        }
      }
    }
  }

  public getRowHeader(): Array<string> {
    return this.items.map<string>((item: StatsItem) => {
      return item.getName();
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
