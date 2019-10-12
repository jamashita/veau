import { JSONable } from '../../veau-general/JSONable';
import { Serializable } from '../../veau-general/Serializable';
import { Languages } from '../collection/Languages';
import { Regions } from '../collection/Regions';
import { Language, LanguageJSON } from '../Language';
import { Region, RegionJSON } from '../Region';

export type LocaleJSON = {
  languages: Array<LanguageJSON>;
  regions: Array<RegionJSON>;
};

export class Locale implements JSONable, Serializable {
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

    return Locale.from(Languages.ofJSON(languages), Regions.ofJSON(regions));
  }

  public static default(): Locale {
    return Locale.from(Languages.default(), Regions.default());
  }

  private constructor(languages: Languages, regions: Regions) {
    this.languages = languages;
    this.regions = regions;
  }

  public getLanguages(): Languages {
    return this.languages;
  }

  public getRegions(): Regions {
    return this.regions;
  }

  public getLanguage(index: number): Language {
    return this.languages.get(index);
  }

  public getRegion(index: number): Region {
    return this.regions.get(index);
  }

  public equals(other: Locale): boolean {
    if (this === other) {
      return true;
    }
    if (!this.languages.equals(other.getLanguages())) {
      return false;
    }
    if (!this.regions.equals(other.getRegions())) {
      return false;
    }

    return true;
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
