import { ValueObject } from '@jamashita/anden-object';
import { UUID, UUIDError } from '@jamashita/anden-uuid';
import { LanguageError } from './error/LanguageError.js';

export class LanguageID extends ValueObject<'LanguageID'> {
  public readonly noun: 'LanguageID' = 'LanguageID';
  private readonly uuid: UUID;

  private static readonly EMPTY: LanguageID = new LanguageID(UUID.v5());

  public static empty(): LanguageID {
    return LanguageID.EMPTY;
  }

  public static of(uuid: UUID): LanguageID {
    return new LanguageID(uuid);
  }

  public static ofString(id: string): LanguageID {
    try {
      return LanguageID.of(UUID.of(id));
    }
    catch (err: unknown) {
      if (err instanceof UUIDError) {
        throw new LanguageError('LanguageID.ofString()', err);
      }

      throw err;
    }
  }

  protected constructor(uuid: UUID) {
    super();
    this.uuid = uuid;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof LanguageID)) {
      return false;
    }

    return this.uuid.equals(other.uuid);
  }

  public serialize(): string {
    return this.uuid.toString();
  }

  public get(): UUID {
    return this.uuid;
  }

  public isEmpty(): boolean {
    return this === LanguageID.empty();
  }
}
