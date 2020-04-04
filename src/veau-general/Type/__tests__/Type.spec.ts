import 'jest';
import { Type } from '../Type';

describe('Type', () => {
  describe('isString', () => {
    it('even if numerical strings given, return true', () => {
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
  });

  describe('isNumber', () => {
    it('returns true even if double values are provided', () =>{
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
  });

  describe('isInteger', () => {
    it('returns false when the double values are given', () => {
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
  });

  describe('isBoolean', () => {
    it('returns true when true and false are given', () => {
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
  });

  describe('isPrimitive', () => {
    it('returns true if the value is null, undefined, boolean, number, string', () => {
      expect(Type.isPrimitive(null)).toEqual(true);
      expect(Type.isPrimitive(undefined)).toEqual(true);
      expect(Type.isPrimitive(false)).toEqual(true);
      expect(Type.isPrimitive(true)).toEqual(true);
      expect(Type.isPrimitive(-1)).toEqual(true);
      expect(Type.isPrimitive(0)).toEqual(true);
      expect(Type.isPrimitive(1)).toEqual(true);
      expect(Type.isPrimitive('')).toEqual(true);
      expect(Type.isPrimitive('a')).toEqual(true);
      expect(Type.isPrimitive('0')).toEqual(true);
      expect(Type.isPrimitive('1')).toEqual(true);
      expect(Type.isPrimitive([])).toEqual(false);
      expect(Type.isPrimitive([null])).toEqual(false);
      expect(Type.isPrimitive([undefined])).toEqual(false);
      expect(Type.isPrimitive({})).toEqual(false);
      expect(Type.isPrimitive({key: null})).toEqual(false);
      expect(Type.isPrimitive({key: undefined})).toEqual(false);
    });
  });

  describe('isPlainObject', () => {
    it('returns false if array is given', () => {
      expect(Type.isPlainObject(null)).toEqual(false);
      expect(Type.isPlainObject(undefined)).toEqual(false);
      expect(Type.isPlainObject('')).toEqual(false);
      expect(Type.isPlainObject('123')).toEqual(false);
      expect(Type.isPlainObject('abcd')).toEqual(false);
      expect(Type.isPlainObject(123)).toEqual(false);
      expect(Type.isPlainObject(0)).toEqual(false);
      expect(Type.isPlainObject(-12)).toEqual(false);
      expect(Type.isPlainObject(0.3)).toEqual(false);
      expect(Type.isPlainObject(false)).toEqual(false);
      expect(Type.isPlainObject(true)).toEqual(false);
      expect(Type.isPlainObject({})).toEqual(true);
      expect(Type.isPlainObject([])).toEqual(false);
      expect(Type.isPlainObject(new Error())).toEqual(false);
    });
  });

  describe('isArray', () => {
    it('returns true only if the array is given', () => {
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
});
