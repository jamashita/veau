import { ValueObject } from '../veau-general/ValueObject';

const DEFAULT_ID: number = 0;

export class LanguageID extends ValueObject {
  public readonly noun: 'LanguageID' = 'LanguageID';
  private readonly id: number;

  private static readonly DEFAULT: LanguageID = LanguageID.of(DEFAULT_ID);

  public static of(id: number): LanguageID {
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
