import { RuntimeError } from '../veau-general/RuntimeError';
import { UUID } from '../veau-general/UUID';
import { ValueObject } from '../veau-general/ValueObject';

export class StatsItemID extends ValueObject {
  private id: string;

  public static of(id: string): StatsItemID {
    if (id.length === UUID.size()) {
      return new StatsItemID(id);
    }

    throw new RuntimeError(`StatsItemID requires ${UUID.size()} LENGTH`);
  }

  private constructor(id: string) {
    super();
    this.id = id;
  }

  public get(): string {
    return this.id;
  }

  public equals(other: StatsItemID): boolean {
    if (this === other) {
      return true;
    }
    if (this.id === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.id;
  }
}
