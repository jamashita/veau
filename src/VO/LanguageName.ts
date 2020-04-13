import { ValueObject } from '../General/ValueObject';

const EMPTY_NAME: string = '';

export class LanguageName extends ValueObject {
  public readonly noun: 'LanguageName' = 'LanguageName';
  private readonly name: string;

  private static readonly EMPTY: LanguageName = LanguageName.of(EMPTY_NAME);

  public static of(name: string): LanguageName {
    return new LanguageName(name);
  }

  public static empty(): LanguageName {
    return LanguageName.EMPTY;
  }

  protected constructor(name: string) {
    super();
    this.name = name;
  }

  public get(): string {
    return this.name;
  }

  public isEmpty(): boolean {
    if (this === LanguageName.EMPTY) {
      return true;
    }

    return false;
  }

  public equals(other: LanguageName): boolean {
    if (this === other) {
      return true;
    }
    if (this.name === other.name) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.name;
  }
}
