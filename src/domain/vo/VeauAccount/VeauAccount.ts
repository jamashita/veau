import { ValueObject } from '@jamashita/anden-object';
import { JSONable, Kind } from '@jamashita/anden-type';
import { AccountName } from '../Account/AccountName.js';
import { LanguageError } from '../Language/error/LanguageError.js';
import { LanguageID } from '../Language/LanguageID.js';
import { RegionError } from '../Region/error/RegionError.js';
import { RegionID } from '../Region/RegionID.js';
import { VeauAccountError } from './error/VeauAccountError.js';
import { VeauAccountID } from './VeauAccountID.js';

export type VeauAccountJSON = Readonly<{
  veauAccountID: string;
  languageID: string;
  regionID: string;
  name: string;
}>;

export class VeauAccount extends ValueObject<'VeauAccount'> implements JSONable<VeauAccountJSON> {
  public readonly noun: 'VeauAccount' = 'VeauAccount';
  private readonly veauAccountID: VeauAccountID;
  private readonly languageID: LanguageID;
  private readonly regionID: RegionID;
  private readonly name: AccountName;

  public static empty(): VeauAccount {
    return VeauAccount.of(
      VeauAccountID.generate(),
      LanguageID.empty(),
      RegionID.empty(),
      AccountName.empty()
    );
  }

  public static of(
    veauAccountID: VeauAccountID,
    languageID: LanguageID,
    regionID: RegionID,
    name: AccountName
  ): VeauAccount {
    return new VeauAccount(veauAccountID, languageID, regionID, name);
  }

  public static ofJSON(json: VeauAccountJSON): VeauAccount {
    try {
      return VeauAccount.of(
        VeauAccountID.ofString(json.veauAccountID),
        LanguageID.ofString(json.languageID),
        RegionID.ofString(json.regionID),
        AccountName.of(json.name)
      );
    }
    catch (err: unknown) {
      if (err instanceof VeauAccountError || err instanceof LanguageError || err instanceof RegionError) {
        throw new VeauAccountError('VeauAccount.ofJSON()', err);
      }

      throw err;
    }
  }

  public static validate(n: unknown): n is VeauAccountJSON {
    if (!Kind.isObject<VeauAccountJSON>(n)) {
      return false;
    }
    if (!Kind.isString(n.veauAccountID)) {
      return false;
    }
    if (!Kind.isString(n.languageID)) {
      return false;
    }
    if (!Kind.isString(n.regionID)) {
      return false;
    }
    if (!Kind.isString(n.name)) {
      return false;
    }

    return true;
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

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof VeauAccount)) {
      return false;
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

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.veauAccountID.toString());
    properties.push(this.languageID.toString());
    properties.push(this.regionID.toString());
    properties.push(this.name.toString());

    return properties.join(' ');
  }

  public toJSON(): VeauAccountJSON {
    return {
      veauAccountID: this.veauAccountID.get().get(),
      languageID: this.languageID.get().get(),
      regionID: this.regionID.get().get(),
      name: this.name.get()
    };
  }

  public getAccountName(): AccountName {
    return this.name;
  }

  public getLanguageID(): LanguageID {
    return this.languageID;
  }

  public getRegionID(): RegionID {
    return this.regionID;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }
}
