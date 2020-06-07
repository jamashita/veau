import { Alive, Dead, Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { UUID, UUIDError } from '@jamashita/publikum-uuid';

import { LanguageIDError } from './Error/LanguageIDError';

export class LanguageID extends ValueObject<LanguageID> {
  public readonly noun: 'LanguageID' = 'LanguageID';
  private readonly uuid: UUID;

  private static readonly EMPTY: LanguageID = new LanguageID(UUID.v5());

  public static of(uuid: UUID): LanguageID {
    return new LanguageID(uuid);
  }

  public static ofString(id: string): Superposition<LanguageID, LanguageIDError> {
    return Schrodinger.playground<UUID, UUIDError>(() => {
      return UUID.of(id);
    }).transform<LanguageID, LanguageIDError>(
      (uuid: UUID) => {
        return Alive.of<LanguageID, LanguageIDError>(LanguageID.of(uuid));
      },
      (err: UUIDError) => {
        return Dead.of<LanguageID, LanguageIDError>(new LanguageIDError('LanguageID.ofString()', err));
      }
    );
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
