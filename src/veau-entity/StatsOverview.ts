import * as moment from 'moment';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { StatsID } from '../veau-vo/StatsID';
import { Entity } from './Entity';

export type StatsOverviewJSON = {
  statsID: string;
  iso639: string;
  iso3166: string;
  name: string;
  updatedAt: string;
};

export type StatsOverviewRow = {
  statsID: string;
  iso639: string;
  iso3166: string;
  name: string;
  updatedAt: Date;
};

export class StatsOverview extends Entity<StatsID> {
  private statsID: StatsID;
  private iso639: ISO639;
  private iso3166: ISO3166;
  private name: string;
  private updatedAt: moment.Moment;

  public constructor(statsID: StatsID, iso639: ISO639, iso3166: ISO3166, name: string, updatedAt: moment.Moment) {
    super();
    this.statsID = statsID;
    this.iso639 = iso639;
    this.iso3166 = iso3166;
    this.name = name;
    this.updatedAt = updatedAt;
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

  public getName(): string {
    return this.name;
  }

  public getUpdatedAt(): moment.Moment {
    return this.updatedAt;
  }

  public getIdentifier(): StatsID {
    return this.statsID;
  }

  public toJSON(): StatsOverviewJSON {
    const {
      statsID,
      iso639,
      iso3166,
      name,
      updatedAt
    } = this;

    return {
      statsID: statsID.get().get(),
      iso639: iso639.get(),
      iso3166: iso3166.get(),
      name,
      updatedAt: updatedAt.utc().format('YYYY-MM-DDTHH:mm:ss.SSS')
    };
  }

  public toString(): string {
    const {
      statsID,
      iso639,
      iso3166,
      name,
      updatedAt
    } = this;

    return `${statsID.toString()} ${iso639.toString()} ${iso3166.toString()} ${name} ${updatedAt.toJSON()}`;
  }
}
