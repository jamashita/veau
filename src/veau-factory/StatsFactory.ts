import * as moment from 'moment';
import { Stats, StatsJSON, StatsRow } from '../veau-entity/Stats';
import { StatsItem, StatsItemJSON } from '../veau-entity/StatsItem';
import { TermRepository } from '../veau-repository/TermRepository';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { Language } from '../veau-vo/Language';
import { LanguageID } from '../veau-vo/LanguageID';
import { Region } from '../veau-vo/Region';
import { RegionID } from '../veau-vo/RegionID';
import { StatsID } from '../veau-vo/StatsID';
import { Term } from '../veau-vo/Term';
import { UUID } from '../veau-vo/UUID';
import { StatsItemFactory } from './StatsItemFactory';

const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();
const termRepository: TermRepository = TermRepository.getInstance();

export class StatsFactory {
  private static instance: StatsFactory = new StatsFactory();

  public static getInstance(): StatsFactory {
    return StatsFactory.instance;
  }

  private constructor() {
  }

  public from(statsID: StatsID, language: Language, region: Region, term: Term, name: string, updatedAt: moment.Moment, items: Array<StatsItem>): Stats {
    return new Stats(statsID, language, region, term, name, updatedAt, items);
  }

  public fromJSON(json: StatsJSON): Stats {
    const {
      statsID,
      language,
      region,
      termID,
      name,
      updatedAt,
      items
    } = json;

    return this.from(
      StatsID.of(UUID.of(statsID)),
      Language.of(LanguageID.of(language.languageID), language.name, language.englishName, ISO639.of(language.iso639)),
      Region.of(RegionID.of(region.regionID), region.name, ISO3166.of(region.iso3166)),
      termRepository.findByTermID(termID),
      name,
      moment.utc(updatedAt),
      items.map<StatsItem>((item: StatsItemJSON) => {
        return statsItemFactory.fromJSON(item);
      })
    );
  }

  public fromRow(row: StatsRow, stats: Array<StatsItem>): Stats {
    const {
      statsID,
      languageID,
      languageName,
      languageEnglishName,
      iso639,
      regionID,
      regionName,
      iso3166,
      termID,
      name,
      updatedAt
    } = row;

    const language: Language = Language.of(LanguageID.of(languageID), languageName, languageEnglishName, ISO639.of(iso639));
    const region: Region = Region.of(RegionID.of(regionID), regionName, ISO3166.of(iso3166));
    const term: Term = termRepository.findByTermID(termID);

    return this.from(StatsID.of(UUID.of(statsID)), language, region, term, name, moment.utc(updatedAt), stats);
  }
}
