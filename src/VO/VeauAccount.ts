import { VeauAccountError } from '../Error/VeauAccountError';
import { VeauAccountIDError } from '../Error/VeauAccountIDError';
import { JSONable } from '../General/Interface/JSONable';
import { Failure } from '../General/Try/Failure';
import { Success } from '../General/Try/Success';
import { Try } from '../General/Try/Try';
import { ValueObject } from '../General/ValueObject';
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

  public static ofJSON(json: VeauAccountJSON): Try<VeauAccount, VeauAccountError> {
    return VeauAccountID.ofString(json.veauAccountID).match<Try<VeauAccount, VeauAccountError>>((veauAccountID: VeauAccountID) => {
      return Success.of<VeauAccount, VeauAccountError>(
        VeauAccount.of(
          veauAccountID,
          AccountName.of(json.account),
          Language.ofJSON(json.language),
          Region.ofJSON(json.region)
        )
      );
    }, (err: VeauAccountIDError) => {
      return Failure.of<VeauAccount, VeauAccountError>(new VeauAccountError(err.message));
    });
  }

  public static default(): VeauAccount {
    return VeauAccount.of(
      VeauAccountID.generate(),
      AccountName.empty(),
      Language.empty(),
      Region.default()
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

    const {
      veauAccountID,
      account,
      language,
      region
    } = this;

    if (!veauAccountID.equals(other.veauAccountID)) {
      return false;
    }
    if (!account.equals(other.account)) {
      return false;
    }
    if (!language.equals(other.language)) {
      return false;
    }
    if (!region.equals(other.region)) {
      return false;
    }

    return true;
  }

  public toJSON(): VeauAccountJSON {
    const {
      veauAccountID,
      account,
      language,
      region
    } = this;

    return {
      veauAccountID: veauAccountID.get().get(),
      account: account.get(),
      language: language.toJSON(),
      region: region.toJSON()
    };
  }

  public toString(): string {
    const {
      veauAccountID,
      account,
      language,
      region
    } = this;

    return `${veauAccountID.toString()} ${account.toString()} ${language.toString()} ${region.toString()}`;
  }
}
