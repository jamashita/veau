import { Alive, Dead, JSONable, Superposition, ValueObject } from 'publikum';
import { LanguagesError } from '../Error/LanguagesError';
import { LocaleError } from '../Error/LocaleError';
import { RegionsError } from '../Error/RegionsError';
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

  public static ofJSON(json: LocaleJSON): Superposition<Locale, LocaleError> {
    return Languages.ofJSON(json.languages).match<Locale, LocaleError>((languages: Languages) => {
      return Regions.ofJSON(json.regions).match<Locale, LocaleError>((regions: Regions) => {
        return Alive.of<Locale, LocaleError>(
          Locale.of(
            languages,
            regions
          )
        );
      }, (err: RegionsError) => {
        return Dead.of<Locale, LocaleError>(new LocaleError('Locale.ofJSON()', err));
      });
    }, (err: LanguagesError) => {
      return Dead.of<Locale, LocaleError>(new LocaleError('Locale.ofJSON()', err));
    });
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

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.languages.toString());
    properties.push(this.regions.toString());

    return properties.join(' ');
  }
}
