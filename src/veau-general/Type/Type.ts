import check from 'check-types';
import { PlainObject } from './PlainObject';
import { Primitive } from './Primitive';

export class Type {

  public static isString(value: unknown): value is string {
    return check.string(value);
  }

  public static isNumber(value: unknown): value is number {
    return check.number(value);
  }

  public static isInteger(value: unknown): value is number {
    return check.integer(value);
  }

  public static isBoolean(value: unknown): value is boolean {
    return check.boolean(value);
  }

  public static isPrimitive(value: unknown): value is Primitive {
    return check.primitive(value);
  }

  public static isPlainObject(value: unknown): value is PlainObject {
    return check.object(value);
  }

  public static isArray(value: unknown): value is Array<unknown> {
    return check.array(value);
  }

  private constructor() {
  }
}
