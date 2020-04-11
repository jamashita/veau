import { ValueObject } from '../veau-general/ValueObject';

const DEFAULT_NAME: string = '';

export class LanguageName extends ValueObject {
  public readonly noun: 'LanguageName' = 'LanguageName';
  private readonly name: string;

  private static readonly DEFAULT: LanguageName = LanguageName.of(DEFAULT_NAME);

  public static of(name: string): LanguageName {
    return new LanguageName(name);
  }

  public static default(): LanguageName {
    return LanguageName.DEFAULT;
  }

  private constructor(name: string) {
    super();
    this.name = name;
  }

  public get(): string {
    return this.name;
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
