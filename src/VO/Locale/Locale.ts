import { JSONable } from '@jamashita/publikum-interface';
import { ValueObject } from '@jamashita/publikum-object';
import { Kind } from '@jamashita/publikum-type';
import { LanguageError } from '../Language/Error/LanguageError';
import { LanguageJSON } from '../Language/Language';
import { Languages } from '../Language/Languages';
import { RegionError } from '../Region/Error/RegionError';
import { RegionJSON } from '../Region/Region';
import { Regions } from '../Region/Regions';
import { LocaleError } from './Error/LocaleError';

export type LocaleJSON = Readonly<{
  languages: Array<LanguageJSON>;
  regions: Array<RegionJSON>;
}>;

export class Locale extends ValueObject<Locale, 'Locale'> implements JSONable<LocaleJSON> {
  public readonly noun: 'Locale' = 'Locale';
  private readonly languages: Languages;
  private readonly regions: Regions;

  private static readonly EMPTY: Locale = Locale.of(Languages.empty(), Regions.empty());

  public static of(languages: Languages, regions: Regions): Locale {
    return new Locale(languages, regions);
  }

  public static ofJSON(json: LocaleJSON): Locale {
    try {
      return Locale.of(Languages.ofJSON(json.languages), Regions.ofJSON(json.regions));
    }
    catch (err: unknown) {
      if (err instanceof LanguageError || err instanceof RegionError) {
        throw new LocaleError('Locale.ofJSON()', err);
      }

      throw err;
    }
  }

  public static validate(n: unknown): n is LocaleJSON {
    if (!Kind.isObject<LocaleJSON>(n)) {
      return false;
    }
    if (!Languages.validate(n.languages)) {
      return false;
    }
    if (!Regions.validate(n.regions)) {
      return false;
    }

    return true;
  }

  public static empty(): Locale {
    return Locale.EMPTY;
  }

  protected constructor(languages: Languages, regions: Regions) {
    super();
    this.languages = languages;
    this.regions = regions;
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

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.languages.toString());
    properties.push(this.regions.toString());

    return properties.join(' ');
  }

  public getLanguages(): Languages {
    return this.languages;
  }

  public getRegions(): Regions {
    return this.regions;
  }
}
