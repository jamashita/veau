import { Language, LanguageJSON } from '../veau-vo/Language';
import { Locale, LocaleJSON } from '../veau-vo/Locale';
import { StatsID } from '../veau-vo/StatsID';
import { Entity } from './Entity';
import { StatsItem, StatsItemJSON } from './StatsItem';

export type StatsJSON = {
  statsID: string;
  language: LanguageJSON;
  locale: LocaleJSON;
  name: string;
  updatedAt: string;
  items: Array<StatsItemJSON>;
};

export type StatsRow = {
  statsID: string;
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

export class Stats extends Entity<StatsID> {
  private statsID: StatsID;
  private language: Language;
  private locale: Locale;
  private name: string;
  private updatedAt: Date;
  private items: Array<StatsItem>;

  public constructor(statsID: StatsID, language: Language, locale: Locale, name: string, updatedAt: Date, items: Array<StatsItem>) {
    super();
    this.statsID = statsID;
    this.language = language;
    this.locale = locale;
    this.name = name;
    this.updatedAt = updatedAt;
    this.items = items;
  }

  public getStatsID(): StatsID {
    return this.statsID;
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

  public getStats(): Array<StatsItem> {
    return this.items;
  }

  public getIdentifier(): StatsID {
    return this.statsID;
  }

  public toJSON(): StatsJSON {
    const {
      statsID,
      language,
      locale,
      name,
      updatedAt,
      items
    } = this;

    return {
      statsID: statsID.get().get(),
      language: language.toJSON(),
      locale: locale.toJSON(),
      name,
      updatedAt: updatedAt.toJSON(),
      items: items.map<StatsItemJSON>((item: StatsItem) => {
        return item.toJSON();
      })
    };
  }

  public toString(): string {
    const {
      statsID,
      language,
      locale,
      name,
      updatedAt
    } = this;

    return `${statsID.toString()} ${language.toString()} ${locale.toString()} ${name} ${updatedAt.toJSON()}`;
  }
}
