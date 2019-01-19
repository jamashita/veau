import {LanguageID} from '../veau-vo/LanguageID';
import {LocaleID} from '../veau-vo/LocaleID';
import {VeauAccountID} from '../veau-vo/VeauAccountID';
import {Entity} from './Entity';

export type VeauAccountJSON = {
  id: number;
  account: string;
  languageID: number;
  localeID: number;
  active: boolean;
};

export type VeauAccountRow = {
  id: number;
  account: string;
  languageID: number;
  localeID: number;
  active: number;
};

export class VeauAccount extends Entity<VeauAccountID> {
  private veauAccountID: VeauAccountID;
  private account: string;
  private languageID: LanguageID;
  private localeID: LocaleID;
  private active: boolean;

  public constructor(veauAccountID: VeauAccountID, account: string, languageID: LanguageID, localeID: LocaleID, active: boolean) {
    super();
    this.veauAccountID = veauAccountID;
    this.account = account;
    this.languageID = languageID;
    this.localeID = localeID;
    this.active = active;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }

  public getAccount(): string {
    return this.account;
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
      account,
      languageID,
      localeID,
      active
    } = this;

    return {
      id: veauAccountID.get(),
      account,
      languageID: languageID.get(),
      localeID: localeID.get(),
      active
    };
  }

  public toString(): string {
    const {
      veauAccountID,
      account,
      languageID,
      localeID,
      active
    } = this;

    return `${veauAccountID.toString()} ${account} ${languageID.toString()} ${localeID.toString()} ${active}`;
  }
}
