import * as check from 'check-types';
import moment from 'moment';

export class Type {

  public static isString(value: any): boolean {
    if (check.string(value)) {
      return true;
    }

    return false;
  }

  public static isNumber(value: any): boolean {
    if (check.number(value)) {
      return true;
    }

    return false;
  }

  public static isInteger(value: any): boolean {
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

  public static isPlainObject(value: any): boolean {
    if (check.object(value)) {
      return true;
    }

    return false;
  }

  public static isArray(value: any): boolean {
    if (check.array(value)) {
      return true;
    }

    return false;
  }

  public static isDateString(value: any): boolean {
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
