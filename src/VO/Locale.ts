import { JSONable } from '../General/Interface/JSONable';
import { ValueObject } from '../General/Object/ValueObject';
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

  private static readonly EMPTY: Locale = Locale.of(
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

  public static empty(): Locale {
    return Locale.EMPTY;
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
    return {
      languages: this.languages.toJSON(),
      regions: this.regions.toJSON()
    };
  }

  protected serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.languages.toString());
    properties.push(this.regions.toString());

    return properties.join(' ');
  }
}
