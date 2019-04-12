import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { Entity } from './Entity';

export type VeauAccountJSON = {
  id: string;
  account: string;
  language: string;
  region: string;
};

export type VeauAccountRow = {
  id: string;
  account: string;
  language: string;
  region: string;
  hash: string;
};

export class VeauAccount extends Entity<VeauAccountID> {
  private veauAccountID: VeauAccountID;
  private account: string;
  private language: ISO639;
  private region: ISO3166;

  public static default(): VeauAccount {
    return new VeauAccount(VeauAccountID.default(), '', ISO639.default(), ISO3166.default());
  }

  public constructor(veauAccountID: VeauAccountID, account: string, language: ISO639, region: ISO3166) {
    super();
    this.veauAccountID = veauAccountID;
    this.account = account;
    this.language = language;
    this.region = region;
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

  public getRegion(): ISO3166 {
    return this.region;
  }

  public getIdentifier(): VeauAccountID {
    return this.veauAccountID;
  }

  public isDefault(): boolean {
    if (this.getVeauAccountID().equals(VeauAccountID.default())) {
      return true;
    }

    return false;
  }

  public copy(): VeauAccount {
    const {
      veauAccountID,
      account,
      language,
      region
    } = this;

    return new VeauAccount(veauAccountID, account, language, region);
  }

  public toJSON(): VeauAccountJSON {
    const {
      veauAccountID,
      account,
      language,
      region
    } = this;

    return {
      id: veauAccountID.get().get(),
      account,
      language: language.get(),
      region: region.get()
    };
  }

  public toString(): string {
    const {
      veauAccountID,
      account,
      language,
      region
    } = this;

    return `${veauAccountID.toString()} ${account} ${language.get()} ${region.get()}`;
  }
}
