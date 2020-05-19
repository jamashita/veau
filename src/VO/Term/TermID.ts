import { Alive, Dead, Superposition, UUID, UUIDError, ValueObject } from 'publikum';
import { TermIDError } from './Error/TermIDError';

export class TermID extends ValueObject {
  public readonly noun: 'TermID' = 'TermID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): TermID {
    return new TermID(uuid);
  }

  public static ofString(id: string): Superposition<TermID, TermIDError> {
    // prettier-ignore
    try {
      const uuid: UUID = UUID.of(id);

      return Alive.of<TermID, TermIDError>(TermID.of(uuid));
    }
    catch (err) {
      if (err instanceof UUIDError) {
        return Dead.of<TermID, TermIDError>(new TermIDError('TermID.ofString()', err));
      }

      throw err;
    }
  }

  protected constructor(uuid: UUID) {
    super();
    this.uuid = uuid;
  }

  public get(): UUID {
    return this.uuid;
  }

  public equals(other: TermID): boolean {
    if (this === other) {
      return true;
    }

    return this.uuid.equals(other.uuid);
  }

  public serialize(): string {
    return this.uuid.toString();
  }
}
