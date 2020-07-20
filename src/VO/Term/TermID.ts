import { Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { UUID, UUIDError } from '@jamashita/publikum-uuid';

import { TermIDError } from './Error/TermIDError';

export class TermID extends ValueObject<TermID, 'TermID'> {
  public readonly noun: 'TermID' = 'TermID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): TermID {
    return new TermID(uuid);
  }

  public static ofString(id: string): Superposition<TermID, TermIDError> {
    return Superposition.playground<UUID, UUIDError>(() => {
      return UUID.of(id);
    }, UUIDError).transform<TermID, TermIDError>(
      (uuid: UUID) => {
        return TermID.of(uuid);
      },
      (err: UUIDError) => {
        throw new TermIDError('TermID.ofString()', err);
      },
      TermIDError
    );
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
