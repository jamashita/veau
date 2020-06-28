import { ValueObject } from '@jamashita/publikum-object';

const EMPTY_NAME: string = '';

export class LanguageName extends ValueObject<LanguageName, 'LanguageName'> {
  public readonly noun: 'LanguageName' = 'LanguageName';
  private readonly name: string;

  private static readonly EMPTY: LanguageName = new LanguageName(EMPTY_NAME);

  public static of(name: string): LanguageName {
    if (name === EMPTY_NAME) {
      return LanguageName.empty();
    }

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
    if (this === LanguageName.empty()) {
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

  public serialize(): string {
    return this.name;
  }
}
