import { ISO3166 } from '../ISO3166';

describe('ISO3166', () => {
  describe('empty', () => {
    it('always returns empty string', () => {
      expect(ISO3166.empty().get()).toBe('');
    });

    it('returns singleton instance', () => {
      expect(ISO3166.empty()).toBe(ISO3166.empty());
    });
  });

  describe('of', () => {
    it('returns ISO3166.empty() when empty string is given', () => {
      expect(ISO3166.of('')).toBe(ISO3166.empty());
    });

    it('normal case', () => {
      const iso31661: string = 'AFG';
      const iso31662: string = 'ALB';

      expect(ISO3166.of(iso31661).get()).toBe(iso31661);
      expect(ISO3166.of(iso31662).get()).toBe(iso31662);
    });
  });

  describe('isEmpty', () => {
    it('returns true when ISO3166.empty() is given', () => {
      expect(ISO3166.empty().isEmpty()).toBe(true);
    });

    it('normal case', () => {
      const iso31661: string = 'AFG';
      const iso31662: string = 'ALB';

      expect(ISO3166.of(iso31661).isEmpty()).toBe(false);
      expect(ISO3166.of(iso31662).isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const iso3166: ISO3166 = ISO3166.of('ab');

      expect(iso3166.equals(null)).toBe(false);
      expect(iso3166.equals(undefined)).toBe(false);
      expect(iso3166.equals('')).toBe(false);
      expect(iso3166.equals('123')).toBe(false);
      expect(iso3166.equals('abcd')).toBe(false);
      expect(iso3166.equals(123)).toBe(false);
      expect(iso3166.equals(0)).toBe(false);
      expect(iso3166.equals(-12)).toBe(false);
      expect(iso3166.equals(0.3)).toBe(false);
      expect(iso3166.equals(false)).toBe(false);
      expect(iso3166.equals(true)).toBe(false);
      expect(iso3166.equals(Symbol('p'))).toBe(false);
      expect(iso3166.equals(20n)).toBe(false);
      expect(iso3166.equals({})).toBe(false);
      expect(iso3166.equals([])).toBe(false);
      expect(iso3166.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the property is the same', () => {
      const iso31661: ISO3166 = ISO3166.of('AFG');
      const iso31662: ISO3166 = ISO3166.of('ALB');
      const iso31663: ISO3166 = ISO3166.of('AFG');

      expect(iso31661.equals(iso31661)).toBe(true);
      expect(iso31661.equals(iso31662)).toBe(false);
      expect(iso31661.equals(iso31663)).toBe(true);
    });
  });
});
