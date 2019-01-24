import * as moment from 'moment';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { StatsID } from '../veau-vo/StatsID';
import { Term } from '../veau-vo/Term';
import { UUID } from '../veau-vo/UUID';
import { Entity } from './Entity';

export type StatsOverviewJSON = {
  statsID: string;
  iso639: string;
  iso3166: string;
  termID: number;
  name: string;
  updatedAt: string;
};

export type StatsOverviewRow = {
  statsID: string;
  iso639: string;
  iso3166: string;
  termID: number;
  name: string;
  updatedAt: Date;
};

const DATE_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';

export class StatsOverview extends Entity<StatsID> {
  private statsID: StatsID;
  private iso639: ISO639;
  private iso3166: ISO3166;
  private term: Term;
  private name: string;
  private updatedAt: moment.Moment;

  public static default(): StatsOverview {
    return new StatsOverview(StatsID.of(UUID.generate()), ISO639.defualt(), ISO3166.default(), Term.DAILY, '', moment.utc());
  }

  public constructor(statsID: StatsID, iso639: ISO639, iso3166: ISO3166, term: Term, name: string, updatedAt: moment.Moment) {
    super();
    this.statsID = statsID;
    this.iso639 = iso639;
    this.iso3166 = iso3166;
    this.term = term;
    this.name = name;
    this.updatedAt = moment(updatedAt);
  }

  public getStatsID(): StatsID {
    return this.statsID;
  }

  public getISO639(): ISO639 {
    return this.iso639;
  }

  public getISO3166(): ISO3166 {
    return this.iso3166;
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

  public getIdentifier(): StatsID {
    return this.statsID;
  }

  public getUpdatedAtAsString(): string {
    return this.updatedAt.utc().format(DATE_FORMAT);
  }

  public isFilled(): boolean {
    if (this.iso639.equals(ISO639.defualt())) {
      return false;
    }
    if (this.iso3166.equals(ISO3166.default())) {
      return false;
    }
    if (this.name === '') {
      return false;
    }

    return true;
  }

  public toJSON(): StatsOverviewJSON {
    const {
      statsID,
      iso639,
      iso3166,
      term,
      name
    } = this;

    return {
      statsID: statsID.get().get(),
      iso639: iso639.get(),
      iso3166: iso3166.get(),
      termID: term.get(),
      name,
      updatedAt: this.getUpdatedAtAsString()
    };
  }

  public toString(): string {
    const {
      statsID,
      iso639,
      iso3166,
      term,
      name
    } = this;

    return `${statsID.toString()} ${iso639.toString()} ${iso3166.toString()} ${term.toString()} ${name} ${this.getUpdatedAtAsString()}`;
  }
}
