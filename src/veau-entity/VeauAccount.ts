import {LanguageID} from '../veau-vo/LanguageID';
import {LocaleID} from '../veau-vo/LocaleID';
import {VeauAccountID} from '../veau-vo/VeauAccountID';
import {Entity} from './Entity';

export type VeauAccountJSON = {
  id: number;
  name: string;
  languageID: number;
  localeID: number;
  active: boolean;
};

export type VeauAccountRow = {
  id: number;
  name: string;
  languageID: number;
  localeID: number;
  active: number;
};

export class VeauAccount extends Entity<VeauAccountID> {
  private veauAccountID: VeauAccountID;
  private name: string;
  private languageID: LanguageID;
  private localeID: LocaleID;
  private active: boolean;

  public constructor(veauAccountID: VeauAccountID, name: string, languageID: LanguageID, localeID: LocaleID, active: boolean) {
    super();
    this.veauAccountID = veauAccountID;
    this.name = name;
    this.languageID = languageID;
    this.localeID = localeID;
    this.active = active;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }

  public getName(): string {
    return this.name;
  }

  public getLanguageID(): LanguageID {
    return this.languageID;
  }

  public getLocaleID(): LocaleID {
    return this.localeID;
  }

  public isActive(): boolean {
    return this.active;
  }

  public getIdentifier(): VeauAccountID {
    return this.veauAccountID;
  }

  public toJSON(): VeauAccountJSON {
    const {
      veauAccountID,
      name,
      languageID,
      localeID,
      active
    } = this;

    return {
      id: veauAccountID.get(),
      name,
      languageID: languageID.get(),
      localeID: localeID.get(),
      active
    };
  }

  public toString(): string {
    const {
      veauAccountID,
      name,
      languageID,
      localeID,
      active
    } = this;

    return `${veauAccountID.toString()} ${name} ${languageID.toString()} ${localeID.toString()} ${active}`;
  }
}
