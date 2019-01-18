import {UUID} from './UUID';
import {ValueObject} from './ValueObject';

export class CaptionID extends ValueObject {
  private id: UUID;

  public static of(id: UUID): CaptionID {
    return new CaptionID(id);
  }

  private constructor(id: UUID) {
    super();
    this.id = id;
  }

  public get(): UUID {
    return this.id;
  }

  public equals(other: CaptionID): boolean {
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
