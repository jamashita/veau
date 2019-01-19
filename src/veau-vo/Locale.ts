import { ISO3166 } from './ISO3166';
import { LocaleID } from './LocaleID';
import { ValueObject } from './ValueObject';

export type LocaleJSON = {
  localeID: number;
  name: string;
  iso3166: string;
};

export type LocaleRow = {
  localeID: number;
  name: string;
  iso3166: string;
};

export class Locale extends ValueObject {
  private localeID: LocaleID;
  private name: string;
  private iso3166: ISO3166;

  public static of(localeID: LocaleID, name: string, iso3166: ISO3166): Locale {
    return new Locale(localeID, name, iso3166);
  }

  private constructor(localeID: LocaleID, name: string, iso3166: ISO3166) {
    super();
    this.localeID = localeID;
    this.name = name;
    this.iso3166 = iso3166;
  }

  public getLocaleID(): LocaleID {
    return this.localeID;
  }

  public getName(): string {
    return this.name;
  }

  public getISO3166(): ISO3166 {
    return this.iso3166;
  }

  public equals(other: Locale): boolean {
    if (this === other) {
      return true;
    }
    if (this.localeID.equals(other.getLocaleID())) {
      return true;
    }

    return false;
  }

  public toJSON(): LocaleJSON {
    const {
      localeID,
      name,
      iso3166
    } = this;

    return {
      localeID: localeID.get(),
      name,
      iso3166: iso3166.get()
    };
  }

  public toString(): string {
    return this.name;
  }
}
