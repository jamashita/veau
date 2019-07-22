import 'jest';
import { RuntimeError } from '../../veau-error/RuntimeError';
import { Page } from '../Page';

describe('Page', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const page1: Page = Page.of(1);
      const page2: Page = Page.of(2);
      const page3: Page = Page.of(1);

      expect(page1.equals(page1)).toEqual(true);
      expect(page1.equals(page2)).toEqual(false);
      expect(page1.equals(page3)).toEqual(true);
    });
  });

  describe('of', () => {
    it('throws error when the argument is less than 1', () => {
      expect(() => {
        Page.of(0);
      }).toThrow(RuntimeError);
      expect(() => {
        Page.of(-1);
      }).toThrow(RuntimeError);
    });
  });
});
