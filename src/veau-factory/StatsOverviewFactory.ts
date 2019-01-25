import * as moment from 'moment';
import { StatsOverview, StatsOverviewJSON, StatsOverviewRow } from '../veau-entity/StatsOverview';
import { TermRepository } from '../veau-repository/TermRepository';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { StatsID } from '../veau-vo/StatsID';
import { Term } from '../veau-vo/Term';
import { UUID } from '../veau-vo/UUID';

const termRepository: TermRepository = TermRepository.getInstance();

export class StatsOverviewFactory {
  private static instance: StatsOverviewFactory = new StatsOverviewFactory();

  public static getInstance(): StatsOverviewFactory {
    return StatsOverviewFactory.instance;
  }

  private constructor() {
  }

  public from(statsID: StatsID, iso639: ISO639, iso3166: ISO3166, term: Term, name: string, updatedAt: moment.Moment): StatsOverview {
    return new StatsOverview(statsID, iso639, iso3166, term, name, updatedAt);
  }

  public fromJSON(json: StatsOverviewJSON): StatsOverview {
    const {
      statsID,
      iso639,
      iso3166,
      termID,
      name,
      updatedAt
    } = json;

    const term: Term = termRepository.findByTermID(termID);

    return this.from(StatsID.of(UUID.of(statsID)), ISO639.of(iso639), ISO3166.of(iso3166), term, name, moment(updatedAt));
  }

  public fromRow(row: StatsOverviewRow): StatsOverview {
    const {
      statsID,
      iso639,
      iso3166,
      termID,
      name,
      updatedAt
    } = row;

    const term: Term = termRepository.findByTermID(termID);

    return this.from(StatsID.of(UUID.of(statsID)), ISO639.of(iso639), ISO3166.of(iso3166), term, name, moment(updatedAt));
  }
}
