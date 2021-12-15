import { ValueObject } from '@jamashita/anden-object';

const EMPTY_NAME: string = '';

export class LanguageName extends ValueObject<'LanguageName'> {
  public readonly noun: 'LanguageName' = 'LanguageName';
  private readonly name: string;

  private static readonly EMPTY: LanguageName = new LanguageName(EMPTY_NAME);

  public static empty(): LanguageName {
    return LanguageName.EMPTY;
  }

  public static of(name: string): LanguageName {
    if (name === EMPTY_NAME) {
      return LanguageName.empty();
    }

    return new LanguageName(name);
  }

  protected constructor(name: string) {
    super();
    this.name = name;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof LanguageName)) {
      return false;
    }
    if (this.name === other.name) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.name;
  }

  public get(): string {
    return this.name;
  }

  public isEmpty(): boolean {
    return this === LanguageName.empty();
  }
}
