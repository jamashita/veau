import * as _ from 'lodash';

export class Type {

  public static isString(value: any): boolean {
    return _.isString(value);
  }

  public static isNumber(value: any): boolean {
    return _.isNumber(value);
  }

  public static isInteger(value: any): boolean {
    return _.isInteger(value)
  }

  public static isBoolean(value: any): boolean {
    if (value === true) {
      return true;
    }
    if (value === false) {
      return true;
    }

    return false;
  }

  public static isArray(value: any): boolean {
    return _.isArray(value);
  }

  private constructor() {
  }
}
