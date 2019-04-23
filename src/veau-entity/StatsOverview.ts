import * as moment from 'moment';
import { Term } from '../veau-enum/Term';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { StatsID } from '../veau-vo/StatsID';
import { Entity } from './Entity';

export type StatsOverviewJSON = {
  statsID: string;
  iso639: string;
  iso3166: string;
  termID: number;
  name: string;
  unit: string;
  updatedAt: string;
};

export type StatsOverviewRow = {
  statsID: string;
  iso639: string;
  iso3166: string;
  termID: number;
  name: string;
  unit: string;
  updatedAt: string;
};


export class StatsOverview extends Entity<StatsID> {
  private statsID: StatsID;
  private iso639: ISO639;
  private iso3166: ISO3166;
  private term: Term;
  private name: string;
  private unit: string;
  private updatedAt: moment.Moment;

  private static DATE_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';

  public constructor(statsID: StatsID, iso639: ISO639, iso3166: ISO3166, term: Term, name: string, unit: string, updatedAt: moment.Moment) {
    super();
    this.statsID = statsID;
    this.iso639 = iso639;
    this.iso3166 = iso3166;
    this.term = term;
    this.name = name;
    this.unit = unit;
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

  public getUnit(): string {
    return this.unit;
  }

  public getUpdatedAt(): moment.Moment {
    return moment(this.updatedAt);
  }

  public getIdentifier(): StatsID {
    return this.statsID;
  }

  public getUpdatedAtAsString(): string {
    return this.updatedAt.utc().format(StatsOverview.DATE_FORMAT);
  }

  public copy(): StatsOverview {
    const {
      statsID,
      iso639,
      iso3166,
      term,
      name,
      unit,
      updatedAt
    } = this;

    return new StatsOverview(statsID, iso639, iso3166, term, name, unit, moment(updatedAt));
  }

  public toJSON(): StatsOverviewJSON {
    const {
      statsID,
      iso639,
      iso3166,
      term,
      name,
      unit
    } = this;

    return {
      statsID: statsID.get().get(),
      iso639: iso639.get(),
      iso3166: iso3166.get(),
      termID: term.get(),
      name,
      unit,
      updatedAt: this.getUpdatedAtAsString()
    };
  }

  public toString(): string {
    const {
      statsID,
      iso639,
      iso3166,
      term,
      name,
      unit
    } = this;

    return `${statsID.toString()} ${iso639.toString()} ${iso3166.toString()} ${term.toString()} ${name} ${unit} ${this.getUpdatedAtAsString()}`;
  }
}
