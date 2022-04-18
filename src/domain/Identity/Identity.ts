import { ValueObject } from '@jamashita/anden-object';
import { AccountName } from '../Account/AccountName.js';
import { Language } from '../Language/Language.js';
import { Region } from '../Region/Region.js';
import { VeauAccountID } from '../VeauAccount/VeauAccountID.js';

export class Identity extends ValueObject {
  private readonly veauAccountID: VeauAccountID;
  private readonly name: AccountName;
  private readonly language: Language;
  private readonly region: Region;

  public static empty(): Identity {
    return Identity.of(VeauAccountID.generate(), AccountName.empty(), Language.empty(), Region.empty());
  }

  public static of(veauAccountID: VeauAccountID, name: AccountName, language: Language, region: Region): Identity {
    return new Identity(veauAccountID, name, language, region);
  }

  protected constructor(veauAccountID: VeauAccountID, name: AccountName, language: Language, region: Region) {
    super();
    this.veauAccountID = veauAccountID;
    this.name = name;
    this.language = language;
    this.region = region;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Identity)) {
      return false;
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

    return properties.join(', ');
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

  public getVeauAccountID(): VeauAccountID {
    return this.veauAccountID;
  }
}
