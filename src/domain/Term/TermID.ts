import { ValueObject } from '@jamashita/anden-object';
import { UUID, UUIDError } from '@jamashita/anden-uuid';
import { TermError } from './TermError.js';

export class TermID extends ValueObject {
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

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof TermID)) {
      return false;
    }

    return this.uuid.equals(other.uuid);
  }

  public get(): UUID {
    return this.uuid;
  }

  public serialize(): string {
    return this.uuid.toString();
  }
}
