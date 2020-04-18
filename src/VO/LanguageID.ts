import { ValueObject } from '../General/Object/ValueObject';
import { Type } from '../General/Type/Type';

const EMPTY_ID: number = 0;

export class LanguageID extends ValueObject {
  public readonly noun: 'LanguageID' = 'LanguageID';
  private readonly id: number;

  private static readonly EMPTY: LanguageID = new LanguageID(EMPTY_ID);

  public static of(id: number): LanguageID {
    if (id === EMPTY_ID) {
      return LanguageID.empty();
    }
    if (id < 0) {
      return LanguageID.empty();
    }
    if (Type.isInteger(id)) {
      return new LanguageID(id);
    }

    return LanguageID.empty();
  }

  public static empty(): LanguageID {
    return LanguageID.EMPTY;
  }

  protected constructor(id: number) {
    super();
    this.id = id;
  }

  public get(): number {
    return this.id;
  }

  public isEmpty(): boolean {
    if (this === LanguageID.empty()) {
      return true;
    }

    return false;
  }

  public equals(other: LanguageID): boolean {
    if (this === other) {
      return true;
    }
    if (this.id === other.id) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return `${this.id}`;
  }
}
