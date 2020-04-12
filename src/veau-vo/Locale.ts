import { JSONable } from '../veau-general/Interface/JSONable';
import { ValueObject } from '../veau-general/ValueObject';
import { LanguageJSON } from './Language';
import { Languages } from './Languages';
import { RegionJSON } from './Region';
import { Regions } from './Regions';

export type LocaleJSON = Readonly<{
  languages: Array<LanguageJSON>;
  regions: Array<RegionJSON>;
}>;

export class Locale extends ValueObject implements JSONable {
  public readonly noun: 'Locale' = 'Locale';
  private readonly languages: Languages;
  private readonly regions: Regions;

  private static readonly DEFAULT: Locale = Locale.of(
    Languages.empty(),
    Regions.empty()
  );

  public static of(languages: Languages, regions: Regions): Locale {
    return new Locale(languages, regions);
  }

  public static ofJSON(json: LocaleJSON): Locale {
    return Locale.of(
      Languages.ofJSON(json.languages),
      Regions.ofJSON(json.regions)
    );
  }

  public static default(): Locale {
    return Locale.DEFAULT;
  }

  protected constructor(languages: Languages, regions: Regions) {
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

  public equals(other: Locale): boolean {
    if (this === other) {
      return true;
    }
    if (!this.languages.equals(other.languages)) {
      return false;
    }
    if (!this.regions.equals(other.regions)) {
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
