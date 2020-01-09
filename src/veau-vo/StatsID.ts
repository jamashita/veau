import { RuntimeError } from '../veau-general/RuntimeError';
import { UUID } from '../veau-general/UUID';
import { ValueObject } from '../veau-general/ValueObject';

export class StatsID extends ValueObject {
  private id: string;

  public static of(id: string): StatsID {
    if (id.length === UUID.size()) {
      return new StatsID(id);
    }

    throw new RuntimeError(`StatsID requires ${UUID.size().toString()} LENGTH`);
  }

  public static generate(): StatsID {
    return StatsID.of(UUID.v4());
  }

  private constructor(id: string) {
    super();
    this.id = id;
  }

  public get(): string {
    return this.id;
  }

  public equals(other: StatsID): boolean {
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
