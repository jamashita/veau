/* tslint:disable */
import 'jest';
import { Type } from '../Type';

describe('Type', () => {
  it('isString', () => {
    expect(Type.isString(null)).toEqual(false);
    expect(Type.isString(undefined)).toEqual(false);
    expect(Type.isString('')).toEqual(true);
    expect(Type.isString('123')).toEqual(true);
    expect(Type.isString('abcd')).toEqual(true);
    expect(Type.isString(123)).toEqual(false);
    expect(Type.isString(0)).toEqual(false);
    expect(Type.isString(false)).toEqual(false);
    expect(Type.isString(true)).toEqual(false);
    expect(Type.isString({})).toEqual(false);
    expect(Type.isString([])).toEqual(false);
  });

  it('isNumber', () =>{
    expect(Type.isNumber(null)).toEqual(false);
    expect(Type.isNumber(undefined)).toEqual(false);
    expect(Type.isNumber('')).toEqual(false);
    expect(Type.isNumber('123')).toEqual(false);
    expect(Type.isNumber('abcd')).toEqual(false);
    expect(Type.isNumber(123)).toEqual(true);
    expect(Type.isNumber(0)).toEqual(true);
    expect(Type.isNumber(-12)).toEqual(true);
    expect(Type.isNumber(0.3)).toEqual(true);
    expect(Type.isNumber(false)).toEqual(false);
    expect(Type.isNumber(true)).toEqual(false);
    expect(Type.isNumber({})).toEqual(false);
    expect(Type.isNumber([])).toEqual(false);
  });

  it('isInteger', () => {
    expect(Type.isInteger(null)).toEqual(false);
    expect(Type.isInteger(undefined)).toEqual(false);
    expect(Type.isInteger('')).toEqual(false);
    expect(Type.isInteger('123')).toEqual(false);
    expect(Type.isInteger('abcd')).toEqual(false);
    expect(Type.isInteger(123)).toEqual(true);
    expect(Type.isInteger(0)).toEqual(true);
    expect(Type.isInteger(-12)).toEqual(true);
    expect(Type.isInteger(0.3)).toEqual(false);
    expect(Type.isInteger(false)).toEqual(false);
    expect(Type.isInteger(true)).toEqual(false);
    expect(Type.isInteger({})).toEqual(false);
    expect(Type.isInteger([])).toEqual(false);
  });

  it('isBoolean', () => {
    expect(Type.isBoolean(null)).toEqual(false);
    expect(Type.isBoolean(undefined)).toEqual(false);
    expect(Type.isBoolean('')).toEqual(false);
    expect(Type.isBoolean('123')).toEqual(false);
    expect(Type.isBoolean('abcd')).toEqual(false);
    expect(Type.isBoolean(123)).toEqual(false);
    expect(Type.isBoolean(0)).toEqual(false);
    expect(Type.isBoolean(-12)).toEqual(false);
    expect(Type.isBoolean(0.3)).toEqual(false);
    expect(Type.isBoolean(false)).toEqual(true);
    expect(Type.isBoolean(true)).toEqual(true);
    expect(Type.isBoolean({})).toEqual(false);
    expect(Type.isBoolean([])).toEqual(false);
  });

  it('isArray', () => {
    expect(Type.isArray(null)).toEqual(false);
    expect(Type.isArray(undefined)).toEqual(false);
    expect(Type.isArray('')).toEqual(false);
    expect(Type.isArray('123')).toEqual(false);
    expect(Type.isArray('abcd')).toEqual(false);
    expect(Type.isArray(123)).toEqual(false);
    expect(Type.isArray(0)).toEqual(false);
    expect(Type.isArray(-12)).toEqual(false);
    expect(Type.isArray(0.3)).toEqual(false);
    expect(Type.isArray(false)).toEqual(false);
    expect(Type.isArray(true)).toEqual(false);
    expect(Type.isArray({})).toEqual(false);
    expect(Type.isArray([])).toEqual(true);
  });
});
