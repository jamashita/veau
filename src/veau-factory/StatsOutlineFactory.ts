import * as moment from 'moment';
import { Language } from '../veau-entity/Language';
import { Region } from '../veau-entity/Region';
import { StatsOutline, StatsOutlineJSON, StatsOutlineRow } from '../veau-entity/StatsOutline';
import { Term } from '../veau-enum/Term';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { LanguageID } from '../veau-vo/LanguageID';
import { RegionID } from '../veau-vo/RegionID';
import { StatsID } from '../veau-vo/StatsID';

export class StatsOutlineFactory {
  private static instance: StatsOutlineFactory = new StatsOutlineFactory();

  public static getInstance(): StatsOutlineFactory {
    return StatsOutlineFactory.instance;
  }

  private constructor() {
  }

  public from(statsID: StatsID, language: Language, region: Region, term: Term, name: string, unit: string, updatedAt: moment.Moment): StatsOutline {
    return new StatsOutline(statsID, language, region, term, name, unit, updatedAt);
  }

  public fromJSON(json: StatsOutlineJSON): StatsOutline {
    const {
      statsID,
      language,
      region,
      termID,
      name,
      unit,
      updatedAt
    } = json;

    return this.from(
      StatsID.of(statsID),
      Language.fromJSON(language),
      Region.fromJSON(region),
      Term.of(termID),
      name,
      unit,
      moment.utc(updatedAt)
    );
  }

  public fromRow(row: StatsOutlineRow): StatsOutline {
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

    const language: Language = Language.from(LanguageID.of(languageID), languageName, languageEnglishName, ISO639.of(iso639));
    const region: Region = Region.from(RegionID.of(regionID), regionName, ISO3166.of(iso3166));

    return this.from(
      StatsID.of(statsID),
      language,
      region,
      Term.of(termID),
      name,
      unit,
      moment.utc(updatedAt)
    );
  }
}
