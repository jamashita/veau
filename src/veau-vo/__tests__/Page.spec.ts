import 'jest';
import { RuntimeError } from '../../veau-error/RuntimeError';
import { Limit } from '../Limit';
import { Offset } from '../Offset';
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

  describe('getLimit', () => {
    it('always generates the same amount of limit', () => {
      for (let i: number = 1; i <= 10; i++) {
        const page: Page = Page.of(i);
        const limit: Limit = page.getLimit();

        expect(limit.get()).toEqual(40);
      }
    });
  });

  describe('getOffset', () => {
    it('depends the argument which generated Offset is', () => {
      const page1: Page = Page.of(1);
      const offset1: Offset = page1.getOffset();

      expect(offset1.get()).toEqual(0);

      const page2: Page = Page.of(2);
      const offset2: Offset = page2.getOffset();

      expect(offset2.get()).toEqual(40);
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
