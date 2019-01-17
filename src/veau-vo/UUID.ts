import * as uuid from 'uuid/v4';
import {ValueObject} from './ValueObject';

export class UUID extends ValueObject {
  private uuid: string;

  public static generate(): UUID {
    return new UUID(uuid());
  }

  public constructor(uuid: string) {
    super();
    this.uuid = uuid;
  }

  public get(): string {
    return this.uuid;
  }

  public equals(other: UUID): boolean {
    if (this === other) {
      return true;
    }
    if (this.uuid === other.get()) {
      return true;
    }

    return false;
  }

  public toString(): string {
    return this.uuid;
  }
}
