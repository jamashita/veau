import * as _ from 'lodash';
import * as moment from 'moment';

export class Type {

  public static isString(value: any): boolean {
    if (_.isString(value)) {
      return true;
    }

    return false;
  }

  public static isNumber(value: any): boolean {
    if (_.isNumber(value)) {
      return true;
    }

    return false;
  }

  public static isInteger(value: any): boolean {
    if (_.isInteger(value)) {
      return true;
    }

    return false;
  }

  public static isBoolean(value: any): boolean {
    if (_.isBoolean(value)) {
      return true;
    }

    return false;
  }

  public static isPlainObject(value: any): boolean {
    if (_.isPlainObject(value)) {
      return true;
    }

    return false;
  }

  public static isArray(value: any): boolean {
    if (_.isArray(value)) {
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
