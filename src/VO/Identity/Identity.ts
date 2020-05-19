import { ValueObject } from 'publikum';

import { AccountName } from '../Account/AccountName';
import { Language } from '../Language/Language';
import { Region } from '../Region/Region';
import { VeauAccountID } from '../VeauAccount/VeauAccountID';

export class Identity extends ValueObject {
  public readonly noun: 'Identity' = 'Identity';
  private readonly veauAccountID: VeauAccountID;
  private readonly name: AccountName;
  private readonly language: Language;
  private readonly region: Region;

  public static of(veauAccountID: VeauAccountID, name: AccountName, language: Language, region: Region): Identity {
    return new Identity(veauAccountID, name, language, region);
  }

  public static empty(): Identity {
    return Identity.of(VeauAccountID.generate(), AccountName.empty(), Language.empty(), Region.empty());
  }

  protected constructor(veauAccountID: VeauAccountID, name: AccountName, language: Language, region: Region) {
    super();
    this.veauAccountID = veauAccountID;
    this.name = name;
    this.language = language;
    this.region = region;
  }

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }

  public getAccountName(): AccountName {
    return this.name;
  }

  public getLanguage(): Language {
    return this.language;
  }

  public getRegion(): Region {
    return this.region;
  }

  public equals(other: Identity): boolean {
    if (this === other) {
      return true;
    }
    if (!this.veauAccountID.equals(other.veauAccountID)) {
      return false;
    }
    if (!this.name.equals(other.name)) {
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

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.veauAccountID.toString());
    properties.push(this.name.toString());
    properties.push(this.language.toString());
    properties.push(this.region.toString());

    return properties.join(' ');
  }
}
