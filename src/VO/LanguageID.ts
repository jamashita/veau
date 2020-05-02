import { Alive, Dead, Superposition, UUID, UUIDError, ValueObject } from 'publikum';
import { LanguageIDError } from '../Error/LanguageIDError';

export class LanguageID extends ValueObject {
  public readonly noun: 'LanguageID' = 'LanguageID';
  private readonly uuid: UUID;

  private static readonly EMPTY: LanguageID = new LanguageID(UUID.v5());

  public static of(uuid: UUID): LanguageID {
    return new LanguageID(uuid);
  }

  public static ofString(id: string): Superposition<LanguageID, LanguageIDError> {
    try {
      const uuid: UUID = UUID.of(id);

      return Alive.of<LanguageID, LanguageIDError>(LanguageID.of(uuid));
    }
    catch (err) {
      if (err instanceof UUIDError) {
        return Dead.of<LanguageID, LanguageIDError>(
          new LanguageIDError('LanguageID.ofString()', err)
        );
      }

      throw err;
    }
  }

  public static empty(): LanguageID {
    return LanguageID.EMPTY;
  }

  protected constructor(uuid: UUID) {
    super();
    this.uuid = uuid;
  }

  public get(): UUID {
    return this.uuid;
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

    return this.uuid.equals(other.uuid);
  }

  public serialize(): string {
    return this.uuid.toString();
  }
}
