import { ValueObject } from '@jamashita/publikum-object';
import { UUID, UUIDError } from '@jamashita/publikum-uuid';
import { TermError } from './Error/TermError';

export class TermID extends ValueObject<'TermID'> {
  public readonly noun: 'TermID' = 'TermID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): TermID {
    return new TermID(uuid);
  }

  public static ofString(id: string): TermID {
    try {
      return TermID.of(UUID.of(id));
    }
    catch (err: unknown) {
      if (err instanceof UUIDError) {
        throw new TermError('TermID.ofString()', err);
      }

      throw err;
    }
  }

  protected constructor(uuid: UUID) {
    super();
    this.uuid = uuid;
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

  public get(): UUID {
    return this.uuid;
  }
}
