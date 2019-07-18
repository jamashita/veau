import { ValueObject } from './ValueObject';

export class LanguageName extends ValueObject {
  private name: string;

  public static of(name: string): LanguageName {
    return new LanguageName(name);
  }

  public static default(): LanguageName {
    return LanguageName.of('');
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
    if (this.name === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.name;
  }
}
