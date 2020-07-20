import { JSONable } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';

import { LanguagesError } from '../Language/Error/LanguagesError';
import { LanguageJSON } from '../Language/Language';
import { Languages } from '../Language/Languages';
import { RegionsError } from '../Region/Error/RegionsError';
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

  public static ofJSON(json: LocaleJSON): Superposition<Locale, LocaleError> {
    return Languages.ofJSON(json.languages).map<Locale, LanguagesError | RegionsError>((languages: Languages) => {
      return Regions.ofJSON(json.regions).map<Locale, RegionsError>((regions: Regions) => {
        return Locale.of(languages, regions);
      });
    }, RegionsError).recover<Locale, LocaleError>((err: LanguagesError | RegionsError) => {
      throw new LocaleError('Locale.ofJSON()', err);
    }, LocaleError);
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
