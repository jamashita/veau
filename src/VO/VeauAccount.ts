import { VeauAccountError } from '../Error/VeauAccountError';
import { VeauAccountIDError } from '../Error/VeauAccountIDError';
import { JSONable } from '../General/Interface/JSONable';
import { ValueObject } from '../General/Object/ValueObject';
import { Failure } from '../General/Superposition/Failure';
import { Success } from '../General/Superposition/Success';
import { Superposition } from '../General/Superposition/Superposition';
import { AccountName } from './AccountName';
import { Language, LanguageJSON } from './Language';
import { Region, RegionJSON } from './Region';
import { VeauAccountID } from './VeauAccountID';

export type VeauAccountJSON = Readonly<{
  veauAccountID: string;
  account: string;
  language: LanguageJSON;
  region: RegionJSON;
}>;

export class VeauAccount extends ValueObject implements JSONable {
  public readonly noun: 'VeauAccount' = 'VeauAccount';
  private readonly veauAccountID: VeauAccountID;
  private readonly account: AccountName;
  private readonly language: Language;
  private readonly region: Region;

  public static of(
    veauAccountID: VeauAccountID,
    name: AccountName,
    language: Language,
    region: Region
  ): VeauAccount {
    return new VeauAccount(veauAccountID, name, language, region);
  }

  public static ofJSON(json: VeauAccountJSON): Superposition<VeauAccount, VeauAccountError> {
    return VeauAccountID.ofString(json.veauAccountID).match<VeauAccount, VeauAccountError>((veauAccountID: VeauAccountID) => {
      return Success.of<VeauAccount, VeauAccountError>(
        VeauAccount.of(
          veauAccountID,
          AccountName.of(json.account),
          Language.ofJSON(json.language),
          Region.ofJSON(json.region)
        )
      );
    }, (err: VeauAccountIDError) => {
      return Failure.of<VeauAccount, VeauAccountError>(
        new VeauAccountError('VeauAccount.ofJSON()', err)
      );
    });
  }

  public static empty(): VeauAccount {
    return VeauAccount.of(
      VeauAccountID.generate(),
      AccountName.empty(),
      Language.empty(),
      Region.empty()
    );
  }

  protected constructor(
    veauAccountID: VeauAccountID,
    account: AccountName,
    language: Language,
    region: Region
  ) {
    super();
    this.veauAccountID = veauAccountID;
    this.account = account;
    this.language = language;
    this.region = region;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }

  public getAccount(): AccountName {
    return this.account;
  }

  public getLanguage(): Language {
    return this.language;
  }

  public getRegion(): Region {
    return this.region;
  }

  public equals(other: VeauAccount): boolean {
    if (this === other) {
      return true;
    }
    if (!this.veauAccountID.equals(other.veauAccountID)) {
      return false;
    }
    if (!this.account.equals(other.account)) {
      return false;
    }
    if (!this.language.equals(other.language)) {
      return false;
    }
    if (!this.region.equals(other.region)) {
      return false;
    }

    return true;
  }

  public toJSON(): VeauAccountJSON {
    return {
      veauAccountID: this.veauAccountID.get().get(),
      account: this.account.get(),
      language: this.language.toJSON(),
      region: this.region.toJSON()
    };
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.veauAccountID.toString());
    properties.push(this.account.toString());
    properties.push(this.language.toString());
    properties.push(this.region.toString());

    return properties.join(' ');
  }
}
