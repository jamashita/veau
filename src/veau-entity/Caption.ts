import { CaptionID } from '../veau-vo/CaptionID';
import { Language, LanguageJSON } from '../veau-vo/Language';
import { Locale, LocaleJSON } from '../veau-vo/Locale';
import { Entity } from './Entity';
import { Stats, StatsJSON } from './Stats';

export type CaptionJSON = {
  captionID: string;
  language: LanguageJSON;
  locale: LocaleJSON;
  name: string;
  updatedAt: string;
  stats: Array<StatsJSON>;
};

export type CaptionRow = {
  captionID: string;
  languageID: number;
  languageName: string;
  languageEnglishName: string;
  iso639: string;
  localeID: number;
  localeName: string;
  iso3166: string;
  name: string;
  updatedAt: string;
};

export class Caption extends Entity<CaptionID> {
  private captionID: CaptionID;
  private language: Language;
  private locale: Locale;
  private name: string;
  private updatedAt: Date;
  private stats: Array<Stats>;

  public constructor(captionID: CaptionID, language: Language, locale: Locale, name: string, updatedAt: Date, stats: Array<Stats>) {
    super();
    this.captionID = captionID;
    this.language = language;
    this.locale = locale;
    this.name = name;
    this.updatedAt = updatedAt;
    this.stats = stats;
  }

  public getCaptionID(): CaptionID {
    return this.captionID;
  }

  public getLanguage(): Language {
    return this.language;
  }

  public getLocale(): Locale {
    return this.locale;
  }

  public getName(): string {
    return this.name;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getStats(): Array<Stats> {
    return this.stats;
  }

  public getIdentifier(): CaptionID {
    return this.captionID;
  }

  public toJSON(): CaptionJSON {
    const {
      captionID,
      language,
      locale,
      name,
      updatedAt,
      stats
    } = this;

    return {
      captionID: captionID.get().get(),
      language: language.toJSON(),
      locale: locale.toJSON(),
      name,
      updatedAt: updatedAt.toJSON(),
      stats: stats.map<StatsJSON>((piece: Stats) => {
        return piece.toJSON();
      })
    };
  }

  public toString(): string {
    const {
      captionID,
      language,
      locale,
      name,
      updatedAt
    } = this;

    return `${captionID.toString()} ${language.toString()} ${locale.toString()} ${name} ${updatedAt.toJSON()}`;
  }
}
