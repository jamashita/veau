import {ISO3166} from './ISO3166';
import {ValueObject} from './ValueObject';

export type LocaleJSON = {
  name: string;
  iso3166: string;
};

export class Locale extends ValueObject {
  private name: string;
  private iso3166: ISO3166;

  public constructor(name: string, iso3166: ISO3166) {
    super();
    this.name = name;
    this.iso3166 = iso3166;
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
    if (this.iso3166.equals(other.getISO3166())) {
      return true;
    }

    return false;
  }

  public toJSON(): LocaleJSON {
    const {
      name,
      iso3166
    } = this;

    return {
      name,
      iso3166: iso3166.get()
    };
  }

  public toString(): string {
    return this.name;
  }
}
