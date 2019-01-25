import { UUID } from './UUID';
import { ValueObject } from './ValueObject';

export class StatsID extends ValueObject {
  private id: UUID;

  public static of(id: UUID): StatsID {
    return new StatsID(id);
  }

  private constructor(id: UUID) {
    super();
    this.id = id;
  }

  public get(): UUID {
    return this.id;
  }

  public copy(): StatsID {
    const {
      id
    } = this;

    return new StatsID(id.copy());
  }

  public equals(other: StatsID): boolean {
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
