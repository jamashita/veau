import { Stats, StatsJSON, StatsRow } from '../veau-entity/Stats';
import { StatsItem, StatsItemJSON } from '../veau-entity/StatsItem';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { Language } from '../veau-vo/Language';
import { LanguageID } from '../veau-vo/LanguageID';
import { Locale } from '../veau-vo/Locale';
import { LocaleID } from '../veau-vo/LocaleID';
import { StatsID } from '../veau-vo/StatsID';
import { UUID } from '../veau-vo/UUID';
import { StatsItemFactory } from './StatsItemFactory';

const statsItemFactory: StatsItemFactory = StatsItemFactory.getInstance();

export class StatsFactory {
  private static instance: StatsFactory = new StatsFactory();

  public static getInstance(): StatsFactory {
    return StatsFactory.instance;
  }

  private constructor() {
  }

  public from(statsID: StatsID, language: Language, locale: Locale, name: string, updatedAt: Date, items: Array<StatsItem>): Stats {
    return new Stats(statsID, language, locale, name, updatedAt, items);
  }

  public fromJSON(json: StatsJSON): Stats {
    const {
      statsID,
      language,
      locale,
      name,
      updatedAt,
      items
    } = json;

    return this.from(
      StatsID.of(UUID.of(statsID)),
      Language.of(LanguageID.of(language.languageID), language.name, language.englishName, ISO639.of(language.iso639)),
      Locale.of(LocaleID.of(locale.localeID), locale.name, ISO3166.of(locale.iso3166)),
      name,
      new Date(updatedAt),
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
      localeID,
      localeName,
      iso3166,
      name,
      updatedAt
    } = row;

    const language: Language = Language.of(LanguageID.of(languageID), languageName, languageEnglishName, ISO639.of(iso639));
    const locale: Locale = Locale.of(LocaleID.of(localeID), localeName, ISO3166.of(iso3166));

    return this.from(StatsID.of(UUID.of(statsID)), language, locale, name, new Date(updatedAt), stats);
  }
}
