import { ISO3166 } from '../ISO3166';

// DONE
describe('ISO3166', () => {
  describe('empty', () => {
    it('always returns empty string', () => {
      expect(ISO3166.empty().get()).toEqual('');
    });

    it('returns singleton instance', () => {
      expect(ISO3166.empty()).toBe(ISO3166.empty());
    });
  });

  describe('of', () => {
    it('returns ISO3166.empty() when empty string is given', () => {
      expect(ISO3166.of('')).toEqual(ISO3166.empty());
    });

    it('normal case', () => {
      const iso31661: string = 'AFG';
      const iso31662: string = 'ALB';

      expect(ISO3166.of(iso31661).get()).toBe(iso31661);
      expect(ISO3166.of(iso31662).get()).toBe(iso31662);
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      const iso31661: ISO3166 = ISO3166.of('AFG');
      const iso31662: ISO3166 = ISO3166.of('ALB');
      const iso31663: ISO3166 = ISO3166.of('AFG');

      expect(iso31661.equals(iso31661)).toEqual(true);
      expect(iso31661.equals(iso31662)).toEqual(false);
      expect(iso31661.equals(iso31663)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('returns the original string', () => {
      const code: string = 'AFG';
      const iso3166: ISO3166 = ISO3166.of(code);

      expect(iso3166.toString()).toEqual(code);
    });
  });
});
