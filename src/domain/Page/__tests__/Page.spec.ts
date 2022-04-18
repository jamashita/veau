import { Page } from '../Page';
import { PageError } from '../PageError';

describe('Page', () => {
  describe('min', () => {
    it('always returns 1', () => {
      expect(Page.min().get()).toBe(1);
    });

    it('returns singleton instance', () => {
      expect(Page.min()).toBe(Page.min());
    });
  });

  describe('of', () => {
    it('returns Dead when the argument is less than 1', () => {
      expect(() => {
        Page.of(0);
      }).toThrow(PageError);
      expect(() => {
        Page.of(-1);
      }).toThrow(PageError);
    });

    it('returns Alive and its value is Page.min() when the argument 1', () => {
      const page: Page = Page.of(1);

      expect(page).toBe(Page.min());
    });

    it('returns Dead when the argument is not integer', () => {
      expect(() => {
        Page.of(0.1);
      }).toThrow(PageError);
      expect(() => {
        Page.of(1.5);
      }).toThrow(PageError);
    });

    it('normal case', () => {
      const page1: Page = Page.of(1);
      const page2: Page = Page.of(4);

      expect(page1.get()).toBe(1);
      expect(page2.get()).toBe(4);
    });
  });

  describe('equals', () => {
    it('returns false if others given', () => {
      const page: Page = Page.min();

      expect(page.equals(null)).toBe(false);
      expect(page.equals(undefined)).toBe(false);
      expect(page.equals('')).toBe(false);
      expect(page.equals('123')).toBe(false);
      expect(page.equals('abcd')).toBe(false);
      expect(page.equals(123)).toBe(false);
      expect(page.equals(0)).toBe(false);
      expect(page.equals(-12)).toBe(false);
      expect(page.equals(0.3)).toBe(false);
      expect(page.equals(false)).toBe(false);
      expect(page.equals(true)).toBe(false);
      expect(page.equals(Symbol('p'))).toBe(false);
      expect(page.equals(20n)).toBe(false);
      expect(page.equals({})).toBe(false);
      expect(page.equals([])).toBe(false);
      expect(page.equals(Object.create(null))).toBe(false);
    });

    it('returns true if both properties are the same', () => {
      const page1: Page = Page.of(2);
      const page2: Page = Page.of(3);
      const page3: Page = Page.of(2);

      expect(page1.equals(page1)).toBe(true);
      expect(page1.equals(page2)).toBe(false);
      expect(page1.equals(page3)).toBe(true);
    });
  });

  describe('getLimit', () => {
    it('always generates the same amount of limit', () => {
      for (let i: number = 1; i <= 10; i++) {
        const page: Page = Page.of(i);

        expect(page.getLimit().get()).toBe(40);
      }
    });
  });

  describe('getOffset', () => {
    it('depends the argument which generated Offset is', () => {
      const page1: Page = Page.of(1);
      const page2: Page = Page.of(2);

      expect(page1.getOffset().get()).toBe(0);
      expect(page2.getOffset().get()).toBe(40);
    });

    it('throws PageError', () => {
      expect.assertions(1);

      const page: Page = Page.of(1);

      const fn: jest.Mock = jest.fn();

      page.getLimit = fn.mockImplementation(() => {
        throw new PageError('test failed');
      });

      expect(() => {
        page.getOffset();
      }).toThrow(PageError);
    });
  });
});
