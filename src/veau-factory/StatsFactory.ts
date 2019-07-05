import * as moment from 'moment';
import { StatsItems } from '../veau-entity/collection/StatsItems';
import { Language } from '../veau-entity/Language';
import { Region } from '../veau-entity/Region';
import { Stats, StatsJSON, StatsRow } from '../veau-entity/Stats';
import { StatsItem, StatsItemJSON } from '../veau-entity/StatsItem';
import { Term } from '../veau-enum/Term';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { LanguageID } from '../veau-vo/LanguageID';
import { RegionID } from '../veau-vo/RegionID';
import { StatsID } from '../veau-vo/StatsID';
import { UUID } from '../veau-vo/UUID';
import { LanguageFactory } from './LanguageFactory';
import { RegionFactory } from './RegionFactory';
import { StatsItemFactory } from './StatsItemFactory';

const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();
const languageFactory: LanguageFactory = LanguageFactory.getInstance();
const regionFactory: RegionFactory = RegionFactory.getInstance();

export class StatsFactory {
  private static instance: StatsFactory = new StatsFactory();

  public static getInstance(): StatsFactory {
    return StatsFactory.instance;
  }

  private constructor() {
  }

  public from(statsID: StatsID, language: Language, region: Region, term: Term, name: string, unit: string, updatedAt: moment.Moment, items: StatsItems, startDate?: string): Stats {
    return new Stats(statsID, language, region, term, name, unit, updatedAt, items, startDate);
  }

  public fromJSON(json: StatsJSON): Stats {
    const {
      statsID,
      language,
      region,
      termID,
      name,
      unit,
      updatedAt,
      items
    } = json;

    const statsItems: Array<StatsItem> = items.map<StatsItem>((item: StatsItemJSON) => {
      return statsItemFactory.fromJSON(item);
    });

    return this.from(
      StatsID.of(UUID.of(statsID)),
      languageFactory.fromJSON(language),
      regionFactory.fromJSON(region),
      Term.of(termID),
      name,
      unit,
      moment.utc(updatedAt),
      new StatsItems(statsItems)
    );
  }

  public fromRow(row: StatsRow, statItems: Array<StatsItem>): Stats {
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
      unit,
      updatedAt
    } = row;

    const language: Language = languageFactory.from(LanguageID.of(languageID), languageName, languageEnglishName, ISO639.of(iso639));
    const region: Region = regionFactory.from(RegionID.of(regionID), regionName, ISO3166.of(iso3166));
    const term: Term = Term.of(termID);

    return this.from(StatsID.of(UUID.of(statsID)), language, region, term, name, unit, moment.utc(updatedAt), new StatsItems(statItems));
  }
}
