import { Zeit } from '@jamashita/anden-zeit';
import { StatsError } from '../error/StatsError';
import { UpdatedAt } from '../UpdatedAt';

describe('UpdatedAt', () => {
  describe('ofString', () => {
    it('returns Dead if the parameter is not date format', () => {
      expect.assertions(2);

      expect(() => {
        UpdatedAt.ofString('this is not date');
      }).toThrow(StatsError);
      expect(() => {
        UpdatedAt.ofString('2000-01-01');
      }).toThrow(StatsError);
    });

    it('normal case', () => {
      expect.assertions(1);
      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01 00:00:00');

      expect(updatedAt.get().isValid()).toBe(true);
    });
  });

  describe('format', () => {
    it('returns YYYY-MM-DD HH:mm:ss', () => {
      expect.assertions(1);

      expect(UpdatedAt.format()).toBe('YYYY-MM-DD HH:mm:ss');
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      expect.assertions(16);

      const updatedAt: UpdatedAt = UpdatedAt.ofString('2000-01-01 00:00:00');

      expect(updatedAt.equals(null)).toBe(false);
      expect(updatedAt.equals(undefined)).toBe(false);
      expect(updatedAt.equals('')).toBe(false);
      expect(updatedAt.equals('123')).toBe(false);
      expect(updatedAt.equals('abcd')).toBe(false);
      expect(updatedAt.equals(123)).toBe(false);
      expect(updatedAt.equals(0)).toBe(false);
      expect(updatedAt.equals(-12)).toBe(false);
      expect(updatedAt.equals(0.3)).toBe(false);
      expect(updatedAt.equals(false)).toBe(false);
      expect(updatedAt.equals(true)).toBe(false);
      expect(updatedAt.equals(Symbol('p'))).toBe(false);
      expect(updatedAt.equals(20n)).toBe(false);
      expect(updatedAt.equals({})).toBe(false);
      expect(updatedAt.equals([])).toBe(false);
      expect(updatedAt.equals(Object.create(null))).toBe(false);
    });

    it('returns true if both properties are the same', () => {
      expect.assertions(3);

      const at1: UpdatedAt = UpdatedAt.of(Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss'));
      const at2: UpdatedAt = UpdatedAt.of(Zeit.ofString('2000-01-02 00:00:00', 'YYYY-MM-DD HH:mm:ss'));
      const at3: UpdatedAt = UpdatedAt.of(Zeit.ofString('2000-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss'));

      expect(at1.equals(at1)).toBe(true);
      expect(at1.equals(at2)).toBe(false);
      expect(at1.equals(at3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const at: string = '2345-06-07 08:09:10';
      const updatedAt: UpdatedAt = UpdatedAt.ofString(at);

      expect(updatedAt.toString()).toBe(at);
    });
  });
});
