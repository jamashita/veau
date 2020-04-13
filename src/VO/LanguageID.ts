import { ValueObject } from '../General/ValueObject';

const DEFAULT_ID: number = 0;

export class LanguageID extends ValueObject {
  public readonly noun: 'LanguageID' = 'LanguageID';
  private readonly id: number;

  private static readonly DEFAULT: LanguageID = new LanguageID(DEFAULT_ID);

  public static of(id: number): LanguageID {
    if (id === DEFAULT_ID) {
      return LanguageID.default();
    }

    return new LanguageID(id);
  }

  public static default(): LanguageID {
    return LanguageID.DEFAULT;
  }

  protected constructor(id: number) {
    super();
    this.id = id;
  }

  public get(): number {
    return this.id;
  }

  public isDefault(): boolean {
    if (this === LanguageID.DEFAULT) {
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

  public toString(): string {
    return `${this.id}`;
  }
}
