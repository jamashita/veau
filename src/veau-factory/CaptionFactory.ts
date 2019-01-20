import { Caption, CaptionJSON, CaptionRow } from '../veau-entity/Caption';
import { Stats, StatsJSON } from '../veau-entity/Stats';
import { CaptionID } from '../veau-vo/CaptionID';
import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { Language } from '../veau-vo/Language';
import { LanguageID } from '../veau-vo/LanguageID';
import { Locale } from '../veau-vo/Locale';
import { LocaleID } from '../veau-vo/LocaleID';
import { UUID } from '../veau-vo/UUID';
import { StatsFactory } from './StatsFactory';

const statsFactory: StatsFactory = StatsFactory.getInstance();

export class CaptionFactory {
  private static instance: CaptionFactory = new CaptionFactory();

  public static getInstance(): CaptionFactory {
    return CaptionFactory.instance;
  }

  private constructor() {
  }

  public from(captionID: CaptionID, language: Language, locale: Locale, name: string, updatedAt: Date, stats: Array<Stats>): Caption {
    return new Caption(captionID, language, locale, name, updatedAt, stats);
  }

  public fromJSON(json: CaptionJSON): Caption {
    const {
      captionID,
      language,
      locale,
      name,
      updatedAt,
      stats
    } = json;

    return this.from(
      CaptionID.of(UUID.of(captionID)),
      Language.of(LanguageID.of(language.languageID), language.name, language.englishName, ISO639.of(language.iso639)),
      Locale.of(LocaleID.of(locale.localeID), locale.name, ISO3166.of(locale.iso3166)),
      name,
      new Date(updatedAt),
      stats.map<Stats>((piece: StatsJSON) => {
        return statsFactory.fromJSON(piece);
      })
    );
  }

  public fromRow(row: CaptionRow, stats: Array<Stats>): Caption {
    const {
      captionID,
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

    return this.from(CaptionID.of(UUID.of(captionID)), language, locale, name, new Date(updatedAt), stats);
  }
}
