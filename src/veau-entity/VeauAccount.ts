import {ISO3166} from '../veau-vo/ISO3166';
import {ISO639} from '../veau-vo/ISO639';
import {VeauAccountID} from '../veau-vo/VeauAccountID';
import {Entity} from './Entity';

export type VeauAccountJSON = {
  id: number;
  account: string;
  language: string;
  locale: string;
  active: boolean;
};

export type VeauAccountRow = {
  id: number;
  account: string;
  language: string;
  locale: string;
  active: number;
  hash: string;
};

export class VeauAccount extends Entity<VeauAccountID> {
  private veauAccountID: VeauAccountID;
  private account: string;
  private language: ISO639;
  private locale: ISO3166;
  private active: boolean;

  public constructor(veauAccountID: VeauAccountID, account: string, language: ISO639, locale: ISO3166, active: boolean) {
    super();
    this.veauAccountID = veauAccountID;
    this.account = account;
    this.language = language;
    this.locale = locale;
    this.active = active;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }

  public getAccount(): string {
    return this.account;
  }

  public getLanguage(): ISO639 {
    return this.language;
  }

  public getLocale(): ISO3166 {
    return this.locale;
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
      language,
      locale,
      active
    } = this;

    return {
      id: veauAccountID.get(),
      account,
      language: language.get(),
      locale: locale.get(),
      active
    };
  }

  public toString(): string {
    const {
      veauAccountID,
      account,
      language,
      locale,
      active
    } = this;

    return `${veauAccountID.toString()} ${account} ${language.get()} ${locale.get()} ${active}`;
  }
}
