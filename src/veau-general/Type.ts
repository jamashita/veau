import check from 'check-types';
import moment from 'moment';

export class Type {

  public static isString(value: any): value is string {
    if (check.string(value)) {
      return true;
    }

    return false;
  }

  public static isNumber(value: any): value is number {
    if (check.number(value)) {
      return true;
    }

    return false;
  }

  public static isInteger(value: any): value is number {
    if (check.integer(value)) {
      return true;
    }

    return false;
  }

  public static isBoolean(value: any): boolean {
    if (check.boolean(value)) {
      return true;
    }

    return false;
  }

  public static isPlainObject(value: any): value is object {
    if (check.object(value)) {
      return true;
    }

    return false;
  }

  public static isArray(value: any): value is Array {
    if (check.array(value)) {
      return true;
    }

    return false;
  }

  public static isDateString(value: any): value is string {
    if (!Type.isString(value)) {
      return false;
    }
    if (moment(value).isValid()) {
      return true;
    }

    return false;
  }

  private constructor() {
  }
}
