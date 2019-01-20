import { ISO3166 } from '../veau-vo/ISO3166';
import { ISO639 } from '../veau-vo/ISO639';
import { VeauAccountID } from '../veau-vo/VeauAccountID';
import { Entity } from './Entity';

export type VeauAccountJSON = {
  id: number;
  account: string;
  language: string;
  region: string;
};

export type VeauAccountRow = {
  id: number;
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

  public toJSON(): VeauAccountJSON {
    const {
      veauAccountID,
      account,
      language,
      region
    } = this;

    return {
      id: veauAccountID.get(),
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
