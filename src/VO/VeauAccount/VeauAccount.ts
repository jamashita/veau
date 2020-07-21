import { JSONable } from '@jamashita/publikum-interface';
import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';

import { AccountName } from '../Account/AccountName';
import { LanguageIDError } from '../Language/Error/LanguageIDError';
import { LanguageID } from '../Language/LanguageID';
import { RegionIDError } from '../Region/Error/RegionIDError';
import { RegionID } from '../Region/RegionID';
import { VeauAccountError } from './Error/VeauAccountError';
import { VeauAccountIDError } from './Error/VeauAccountIDError';
import { VeauAccountID } from './VeauAccountID';

export type VeauAccountJSON = Readonly<{
  veauAccountID: string;
  languageID: string;
  regionID: string;
  name: string;
}>;

export class VeauAccount extends ValueObject<VeauAccount, 'VeauAccount'> implements JSONable<VeauAccountJSON> {
  public readonly noun: 'VeauAccount' = 'VeauAccount';
  private readonly veauAccountID: VeauAccountID;
  private readonly languageID: LanguageID;
  private readonly regionID: RegionID;
  private readonly name: AccountName;

  public static of(
    veauAccountID: VeauAccountID,
    languageID: LanguageID,
    regionID: RegionID,
    name: AccountName
  ): VeauAccount {
    return new VeauAccount(veauAccountID, languageID, regionID, name);
  }

  public static ofJSON(json: VeauAccountJSON): Superposition<VeauAccount, VeauAccountError> {
    return VeauAccountID.ofString(json.veauAccountID)
      .map<VeauAccount, VeauAccountIDError | LanguageIDError | RegionIDError>(
        (veauAccountID: VeauAccountID) => {
          return LanguageID.ofString(json.languageID).map<VeauAccount, LanguageIDError | RegionIDError>(
            (languageID: LanguageID) => {
              return RegionID.ofString(json.regionID).map<VeauAccount, RegionIDError>((regionID: RegionID) => {
                return VeauAccount.of(veauAccountID, languageID, regionID, AccountName.of(json.name));
              });
            },
            RegionIDError
          );
        },
        LanguageIDError,
        RegionIDError
      )
      .recover<VeauAccount, VeauAccountError>((err: VeauAccountIDError | LanguageIDError | RegionIDError) => {
        throw new VeauAccountError('VeauAccount.ofJSON()', err);
      }, VeauAccountError);
  }

  public static empty(): VeauAccount {
    return VeauAccount.of(VeauAccountID.generate(), LanguageID.empty(), RegionID.empty(), AccountName.empty());
  }

  protected constructor(
    veauAccountID: VeauAccountID,
    languageID: LanguageID,
    regionID: RegionID,
    account: AccountName
  ) {
    super();
    this.veauAccountID = veauAccountID;
    this.languageID = languageID;
    this.regionID = regionID;
    this.name = account;
  }

  public equals(other: VeauAccount): boolean {
    if (this === other) {
      return true;
    }
    if (!this.veauAccountID.equals(other.veauAccountID)) {
      return false;
    }
    if (!this.languageID.equals(other.languageID)) {
      return false;
    }
    if (!this.regionID.equals(other.regionID)) {
      return false;
    }
    if (!this.name.equals(other.name)) {
      return false;
    }

    return true;
  }

  public toJSON(): VeauAccountJSON {
    return {
      veauAccountID: this.veauAccountID.get().get(),
      languageID: this.languageID.get().get(),
      regionID: this.regionID.get().get(),
      name: this.name.get()
    };
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.veauAccountID.toString());
    properties.push(this.languageID.toString());
    properties.push(this.regionID.toString());
    properties.push(this.name.toString());

    return properties.join(' ');
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }

  public getLanguageID(): LanguageID {
    return this.languageID;
  }

  public getRegionID(): RegionID {
    return this.regionID;
  }

  public getAccountName(): AccountName {
    return this.name;
  }
}
