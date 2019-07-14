import { Languages } from '../collection/Languages';
import { Regions } from '../collection/Regions';
import { LanguageJSON } from '../Language';
import { RegionJSON } from '../Region';

export type LocaleJSON = {
  languages: Array<LanguageJSON>;
  regions: Array<RegionJSON>;
};

export class Locale {
  private languages: Languages;
  private regions: Regions;

  public static from(languages: Languages, regions: Regions): Locale {
    return new Locale(languages, regions);
  }

  public static fromJSON(locale: LocaleJSON): Locale {
    const {
      languages,
      regions
    } = locale;

    return Locale.from(Languages.fromJSON(languages), Regions.fromJSON(regions));
  }

  private constructor(languages: Languages, regions: Regions) {
    this.languages = languages;
    this.regions = regions;
  }

  public toJSON(): LocaleJSON {
    const {
      languages,
      regions
    } = this;

    return {
      languages: languages.toJSON(),
      regions: regions.toJSON()
    };
  }

  public toString(): string {
    const {
      languages,
      regions
    } = this;

    return `${languages.toString()} ${regions.toString()}`;
  }
}
