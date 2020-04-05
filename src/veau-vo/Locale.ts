import { JSONable } from '../veau-general/JSONable';
import { Optional } from '../veau-general/Optional/Optional';
import { ValueObject } from '../veau-general/ValueObject';
import { Language, LanguageJSON } from './Language';
import { Languages } from './Languages';
import { Region, RegionJSON } from './Region';
import { Regions } from './Regions';

export type LocaleJSON = {
  languages: Array<LanguageJSON>;
  regions: Array<RegionJSON>;
};

export class Locale extends ValueObject implements JSONable {
  public readonly noun: 'Locale' = 'Locale';
  private languages: Languages;
  private regions: Regions;

  public static of(languages: Languages, regions: Regions): Locale {
    return new Locale(languages, regions);
  }

  public static ofJSON(locale: LocaleJSON): Locale {
    const {
      languages,
      regions
    } = locale;

    return Locale.of(Languages.ofJSON(languages), Regions.ofJSON(regions));
  }

  public static default(): Locale {
    return Locale.of(Languages.empty(), Regions.empty());
  }

  private constructor(languages: Languages, regions: Regions) {
    super();
    this.languages = languages;
    this.regions = regions;
  }

  public getLanguages(): Languages {
    return this.languages;
  }

  public getRegions(): Regions {
    return this.regions;
  }

  public getLanguage(index: number): Optional<Language> {
    return this.languages.get(index);
  }

  public getRegion(index: number): Optional<Region> {
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
