import { Alive, Dead, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { UUID, UUIDError } from '@jamashita/publikum-uuid';

import { TermIDError } from './Error/TermIDError';

export class TermID extends ValueObject {
  public readonly noun: 'TermID' = 'TermID';
  private readonly uuid: UUID;

  public static of(uuid: UUID): TermID {
    return new TermID(uuid);
  }

  public static ofString(id: string): Superposition<TermID, TermIDError> {
    return Schrodinger.playground<UUID, UUIDError>(() => {
      return UUID.of(id);
    }).match<TermID, TermIDError>(
      (uuid: UUID) => {
        return Alive.of<TermID, TermIDError>(TermID.of(uuid));
      },
      (err: UUIDError) => {
        return Dead.of<TermID, TermIDError>(new TermIDError('TermID.ofString()', err));
      }
    );
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
