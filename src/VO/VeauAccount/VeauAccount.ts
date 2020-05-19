import { Alive, Dead, JSONable, Superposition, ValueObject } from 'publikum';

import { RegionIDError } from '../Region/Error/RegionIDError';
import { VeauAccountError } from './Error/VeauAccountError';
import { VeauAccountIDError } from './Error/VeauAccountIDError';
import { AccountName } from '../Account/AccountName';
import { LanguageIDError } from '../Language/Error/LanguageIDError';
import { LanguageID } from '../Language/LanguageID';
import { RegionID } from '../Region/RegionID';
import { VeauAccountID } from './VeauAccountID';

export type VeauAccountJSON = Readonly<{
  veauAccountID: string;
  languageID: string;
  regionID: string;
  name: string;
}>;

export class VeauAccount extends ValueObject implements JSONable {
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
    return VeauAccountID.ofString(json.veauAccountID).match<VeauAccount, VeauAccountError>(
      (veauAccountID: VeauAccountID) => {
        return LanguageID.ofString(json.languageID).match<VeauAccount, VeauAccountError>(
          (languageID: LanguageID) => {
            return RegionID.ofString(json.regionID).match<VeauAccount, VeauAccountError>(
              (regionID: RegionID) => {
                return Alive.of<VeauAccount, VeauAccountError>(
                  VeauAccount.of(veauAccountID, languageID, regionID, AccountName.of(json.name))
                );
              },
              (err: RegionIDError) => {
                return Dead.of<VeauAccount, VeauAccountError>(new VeauAccountError('VeauAccount.ofJSON()', err));
              }
            );
          },
          (err: LanguageIDError) => {
            return Dead.of<VeauAccount, VeauAccountError>(new VeauAccountError('VeauAccount.ofJSON()', err));
          }
        );
      },
      (err: VeauAccountIDError) => {
        return Dead.of<VeauAccount, VeauAccountError>(new VeauAccountError('VeauAccount.ofJSON()', err));
      }
    );
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
}