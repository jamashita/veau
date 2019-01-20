import { UUID } from './UUID';
import { ValueObject } from './ValueObject';

export class StatsItemID extends ValueObject {
  private id: UUID;

  public static of(id: UUID): StatsItemID {
    return new StatsItemID(id);
  }

  private constructor(id: UUID) {
    super();
    this.id = id;
  }

  public get(): UUID {
    return this.id;
  }

  public equals(other: StatsItemID): boolean {
    if (this === other) {
      return true;
    }
    if (this.id.equals(other.get())) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.id.toString();
  }
}
