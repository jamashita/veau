import * as moment from 'moment';
import { Term } from '../veau-enum/Term';
import { StatsID } from '../veau-vo/StatsID';
import { Entity } from './Entity';
import { Language, LanguageJSON } from './Language';
import { Region, RegionJSON } from './Region';

const TERM_FORMAT: string = 'YYYY-MM-DD';

export type StatsOutlineJSON = {
  statsID: string;
  language: LanguageJSON;
  region: RegionJSON;
  termID: number;
  name: string;
  unit: string;
  updatedAt: string;
};

export type StatsOutlineRow = {
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

export class StatsOutline extends Entity<StatsID> {
  private statsID: StatsID;
  private language: Language;
  private region: Region;
  private term: Term;
  private name: string;
  private unit: string;
  private updatedAt: moment.Moment;

  public constructor(statsID: StatsID, language: Language, region: Region, term: Term, name: string, unit: string, updatedAt: moment.Moment) {
    super();
    this.statsID = statsID;
    this.language = language;
    this.region = region;
    this.term = term;
    this.name = name;
    this.unit = unit;
    this.updatedAt = updatedAt;
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

  public getIdentifier(): StatsID {
    return this.statsID;
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

  public copy(): StatsOutline {
    const {
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt
    } = this;

    return new StatsOutline(statsID, language, region, term, name, unit, moment(updatedAt));
  }

  public toJSON(): StatsOutlineJSON {
    const {
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt
    } = this;

    return {
      statsID: statsID.get().get(),
      language: language.toJSON(),
      region: region.toJSON(),
      termID: term.getID(),
      name,
      unit,
      updatedAt: updatedAt.format(TERM_FORMAT)
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
