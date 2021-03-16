import { PageProvider } from '../PageProvider';

describe('PageProvider', () => {
  describe('of', () => {
    it('normal case', () => {
      expect.assertions(1);

      const provider: PageProvider = PageProvider.of(true);

      expect(provider.get()).toBe(true);
    });

    it('return open close singleton instance', () => {
      expect.assertions(2);

      expect(PageProvider.of(true)).toBe(PageProvider.open());
      expect(PageProvider.of(false)).toBe(PageProvider.close());
    });
  });

  describe('open', () => {
    it('normal case', () => {
      expect.assertions(1);

      expect(PageProvider.open().get()).toBe(true);
    });

    it('must be singleton', () => {
      expect.assertions(1);

      expect(PageProvider.open()).toBe(PageProvider.open());
    });
  });

  describe('close', () => {
    it('normal case', () => {
      expect.assertions(1);

      expect(PageProvider.close().get()).toBe(false);
    });

    it('must be singleton', () => {
      expect.assertions(1);

      expect(PageProvider.close()).toBe(PageProvider.close());
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
      expect.assertions(3);

      const provider1: PageProvider = PageProvider.of(false);
      const provider2: PageProvider = PageProvider.of(true);
      const provider3: PageProvider = PageProvider.of(false);

      expect(provider1.equals(provider1)).toBe(true);
      expect(provider1.equals(provider2)).toBe(false);
      expect(provider1.equals(provider3)).toBe(true);
    });
  });

  describe('toString', () => {
    it('returns boolean string', () => {
      expect.assertions(1);

      const provider: PageProvider = PageProvider.of(true);

      expect(provider.toString()).toBe('true');
    });
  });
});
