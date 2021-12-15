import { ValueObject } from '@jamashita/anden-object';
import { JSONable, Kind } from '@jamashita/anden-type';
import { LanguageError } from '../Language/error/LanguageError.js';
import { LanguageJSON } from '../Language/Language.js';
import { Languages } from '../Language/Languages.js';
import { RegionError } from '../Region/error/RegionError.js';
import { RegionJSON } from '../Region/Region.js';
import { Regions } from '../Region/Regions.js';
import { LocaleError } from './error/LocaleError.js';

export type LocaleJSON = Readonly<{
  languages: ReadonlyArray<LanguageJSON>;
  regions: ReadonlyArray<RegionJSON>;
}>;

export class Locale extends ValueObject<'Locale'> implements JSONable<LocaleJSON> {
  public readonly noun: 'Locale' = 'Locale';
  private readonly languages: Languages;
  private readonly regions: Regions;

  private static readonly EMPTY: Locale = Locale.of(Languages.empty(), Regions.empty());

  public static empty(): Locale {
    return Locale.EMPTY;
  }

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

  protected constructor(languages: Languages, regions: Regions) {
    super();
    this.languages = languages;
    this.regions = regions;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Locale)) {
      return false;
    }
    if (!this.languages.equals(other.languages)) {
      return false;
    }
    if (!this.regions.equals(other.regions)) {
      return false;
    }

    return true;
  }

  public serialize(): string {
    const props: Array<string> = [];

    props.push(this.languages.toString());
    props.push(this.regions.toString());

    return props.join(' ');
  }

  public toJSON(): LocaleJSON {
    return {
      languages: this.languages.toJSON(),
      regions: this.regions.toJSON()
    };
  }

  public getLanguages(): Languages {
    return this.languages;
  }

  public getRegions(): Regions {
    return this.regions;
  }
}
