import { ValueObject } from './ValueObject';

export class UUID extends ValueObject {
  private id: string;

  private static UUID_SIZE: number = 36;

  public static of(id: string): UUID {
    return new UUID(id);
  }

  public static size(): number {
    return UUID.UUID_SIZE;
  }

  private constructor(id: string) {
    super();
    this.id = id;
  }

  public get(): string {
    return this.id;
  }

  public equals(other: UUID): boolean {
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
