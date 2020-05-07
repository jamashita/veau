import { PageProvider } from '../PageProvider';

describe('PageProvider', () => {
  describe('of', () => {
    it('normal case', () => {
      const provider: PageProvider = PageProvider.of(true);

      expect(provider.get()).toBe(true);
    });
  });

  describe('open', () => {
    it('normal case', () => {
      expect(PageProvider.open().get()).toBe(true);
    });
  });

  describe('close', () => {
    it('normal case', () => {
      expect(PageProvider.close().get()).toBe(false);
    });
  });

  describe('equals', () => {
    it('returns true if the property is the same', () => {
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
      const provider: PageProvider = PageProvider.of(true);

      expect(provider.toString()).toBe('true');
    });
  });
});
