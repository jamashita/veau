import { Type } from '../Type';

describe('Type', () => {
  describe('isString', () => {
    it('even if numerical strings given, return true', () => {
      expect(Type.isString(null)).toBe(false);
      expect(Type.isString(undefined)).toBe(false);
      expect(Type.isString('')).toBe(true);
      expect(Type.isString('123')).toBe(true);
      expect(Type.isString('abcd')).toBe(true);
      expect(Type.isString(123)).toBe(false);
      expect(Type.isString(0)).toBe(false);
      expect(Type.isString(false)).toBe(false);
      expect(Type.isString(true)).toBe(false);
      expect(Type.isString({})).toBe(false);
      expect(Type.isString([])).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('returns true even if double values are provided', () => {
      expect(Type.isNumber(null)).toBe(false);
      expect(Type.isNumber(undefined)).toBe(false);
      expect(Type.isNumber('')).toBe(false);
      expect(Type.isNumber('123')).toBe(false);
      expect(Type.isNumber('abcd')).toBe(false);
      expect(Type.isNumber(123)).toBe(true);
      expect(Type.isNumber(0)).toBe(true);
      expect(Type.isNumber(-12)).toBe(true);
      expect(Type.isNumber(0.3)).toBe(true);
      expect(Type.isNumber(false)).toBe(false);
      expect(Type.isNumber(true)).toBe(false);
      expect(Type.isNumber({})).toBe(false);
      expect(Type.isNumber([])).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('returns false when the double values are given', () => {
      expect(Type.isInteger(null)).toBe(false);
      expect(Type.isInteger(undefined)).toBe(false);
      expect(Type.isInteger('')).toBe(false);
      expect(Type.isInteger('123')).toBe(false);
      expect(Type.isInteger('abcd')).toBe(false);
      expect(Type.isInteger(123)).toBe(true);
      expect(Type.isInteger(0)).toBe(true);
      expect(Type.isInteger(-12)).toBe(true);
      expect(Type.isInteger(0.3)).toBe(false);
      expect(Type.isInteger(false)).toBe(false);
      expect(Type.isInteger(true)).toBe(false);
      expect(Type.isInteger({})).toBe(false);
      expect(Type.isInteger([])).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('returns true when true and false are given', () => {
      expect(Type.isBoolean(null)).toBe(false);
      expect(Type.isBoolean(undefined)).toBe(false);
      expect(Type.isBoolean('')).toBe(false);
      expect(Type.isBoolean('123')).toBe(false);
      expect(Type.isBoolean('abcd')).toBe(false);
      expect(Type.isBoolean(123)).toBe(false);
      expect(Type.isBoolean(0)).toBe(false);
      expect(Type.isBoolean(-12)).toBe(false);
      expect(Type.isBoolean(0.3)).toBe(false);
      expect(Type.isBoolean(false)).toBe(true);
      expect(Type.isBoolean(true)).toBe(true);
      expect(Type.isBoolean({})).toBe(false);
      expect(Type.isBoolean([])).toBe(false);
    });
  });

  describe('isPrimitive', () => {
    it('returns true if the value is null, undefined, boolean, number, string', () => {
      expect(Type.isPrimitive(null)).toBe(true);
      expect(Type.isPrimitive(undefined)).toBe(true);
      expect(Type.isPrimitive(false)).toBe(true);
      expect(Type.isPrimitive(true)).toBe(true);
      expect(Type.isPrimitive(-1)).toBe(true);
      expect(Type.isPrimitive(0)).toBe(true);
      expect(Type.isPrimitive(1)).toBe(true);
      expect(Type.isPrimitive('')).toBe(true);
      expect(Type.isPrimitive('a')).toBe(true);
      expect(Type.isPrimitive('0')).toBe(true);
      expect(Type.isPrimitive('1')).toBe(true);
      expect(Type.isPrimitive([])).toBe(false);
      expect(Type.isPrimitive([null])).toBe(false);
      expect(Type.isPrimitive([undefined])).toBe(false);
      expect(Type.isPrimitive({})).toBe(false);
      expect(Type.isPrimitive({key: null})).toBe(false);
      expect(Type.isPrimitive({key: undefined})).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    it('returns false if array is given', () => {
      expect(Type.isPlainObject(null)).toBe(false);
      expect(Type.isPlainObject(undefined)).toBe(false);
      expect(Type.isPlainObject('')).toBe(false);
      expect(Type.isPlainObject('123')).toBe(false);
      expect(Type.isPlainObject('abcd')).toBe(false);
      expect(Type.isPlainObject(123)).toBe(false);
      expect(Type.isPlainObject(0)).toBe(false);
      expect(Type.isPlainObject(-12)).toBe(false);
      expect(Type.isPlainObject(0.3)).toBe(false);
      expect(Type.isPlainObject(false)).toBe(false);
      expect(Type.isPlainObject(true)).toBe(false);
      expect(Type.isPlainObject({})).toBe(true);
      expect(Type.isPlainObject([])).toBe(false);
      expect(Type.isPlainObject(new Error())).toBe(false);
    });
  });

  describe('isArray', () => {
    it('returns true only if the array is given', () => {
      expect(Type.isArray(null)).toBe(false);
      expect(Type.isArray(undefined)).toBe(false);
      expect(Type.isArray('')).toBe(false);
      expect(Type.isArray('123')).toBe(false);
      expect(Type.isArray('abcd')).toBe(false);
      expect(Type.isArray(123)).toBe(false);
      expect(Type.isArray(0)).toBe(false);
      expect(Type.isArray(-12)).toBe(false);
      expect(Type.isArray(0.3)).toBe(false);
      expect(Type.isArray(false)).toBe(false);
      expect(Type.isArray(true)).toBe(false);
      expect(Type.isArray({})).toBe(false);
      expect(Type.isArray([])).toBe(true);
    });
  });
});
