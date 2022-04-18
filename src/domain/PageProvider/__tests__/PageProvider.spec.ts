import { PageProvider } from '../PageProvider';

describe('PageProvider', () => {
  describe('of', () => {
    it('normal case', () => {
      const provider: PageProvider = PageProvider.of(true);

      expect(provider.get()).toBe(true);
    });

    it('return open close singleton instance', () => {
      expect(PageProvider.of(true)).toBe(PageProvider.open());
      expect(PageProvider.of(false)).toBe(PageProvider.close());
    });
  });

  describe('open', () => {
    it('normal case', () => {
      expect(PageProvider.open().get()).toBe(true);
    });

    it('must be singleton', () => {
      expect(PageProvider.open()).toBe(PageProvider.open());
    });
  });

  describe('close', () => {
    it('normal case', () => {
      expect(PageProvider.close().get()).toBe(false);
    });

    it('must be singleton', () => {
      expect(PageProvider.close()).toBe(PageProvider.close());
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const pageProvider: PageProvider = PageProvider.close();

      expect(pageProvider.equals(null)).toBe(false);
      expect(pageProvider.equals(undefined)).toBe(false);
      expect(pageProvider.equals('')).toBe(false);
      expect(pageProvider.equals('123')).toBe(false);
      expect(pageProvider.equals('abcd')).toBe(false);
      expect(pageProvider.equals(123)).toBe(false);
      expect(pageProvider.equals(0)).toBe(false);
      expect(pageProvider.equals(-12)).toBe(false);
      expect(pageProvider.equals(0.3)).toBe(false);
      expect(pageProvider.equals(false)).toBe(false);
      expect(pageProvider.equals(true)).toBe(false);
      expect(pageProvider.equals(Symbol('p'))).toBe(false);
      expect(pageProvider.equals(20n)).toBe(false);
      expect(pageProvider.equals({})).toBe(false);
      expect(pageProvider.equals([])).toBe(false);
      expect(pageProvider.equals(Object.create(null))).toBe(false);
    });

    it('returns true if the property is the same', () => {
      const provider1: PageProvider = PageProvider.of(false);
      const provider2: PageProvider = PageProvider.of(true);
      const provider3: PageProvider = PageProvider.of(false);

      expect(provider1.equals(provider1)).toBe(true);
      expect(provider1.equals(provider2)).toBe(false);
      expect(provider1.equals(provider3)).toBe(true);
    });
  });
});
