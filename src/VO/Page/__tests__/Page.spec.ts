import sinon, { SinonStub } from 'sinon';
import { PageError } from '../Error/PageError';
import { Page } from '../Page';

describe('Page', () => {
  describe('min', () => {
    it('always returns 1', () => {
      expect.assertions(1);

      expect(Page.min().get()).toBe(1);
    });

    it('returns singleton instance', () => {
      expect.assertions(1);

      expect(Page.min()).toBe(Page.min());
    });
  });

  describe('of', () => {
    it('returns Dead when the argument is less than 1', () => {
      expect.assertions(2);

      expect(() => {
        Page.of(0);
      }).toThrow(PageError);
      expect(() => {
        Page.of(-1);
      }).toThrow(PageError);
    });

    it('returns Alive and its value is Page.min() when the argument 1', () => {
      expect.assertions(1);

      const page: Page = Page.of(1);

      expect(page).toBe(Page.min());
    });

    it('returns Dead when the argument is not integer', () => {
      expect.assertions(2);

      expect(() => {
        Page.of(0.1);
      }).toThrow(PageError);
      expect(() => {
        Page.of(1.5);
      }).toThrow(PageError);
    });

    it('normal case', () => {
      expect.assertions(2);

      const page1: Page = Page.of(1);
      const page2: Page = Page.of(4);

      expect(page1.get()).toBe(1);
      expect(page2.get()).toBe(4);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      expect.assertions(3);

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
      expect.assertions(10);

      for (let i: number = 1; i <= 10; i++) {
        const page: Page = Page.of(i);

        expect(page.getLimit().get()).toBe(40);
      }
    });
  });

  describe('getOffset', () => {
    it('depends the argument which generated Offset is', () => {
      expect.assertions(2);

      const page1: Page = Page.of(1);
      const page2: Page = Page.of(2);

      expect(page1.getOffset().get()).toBe(0);
      expect(page2.getOffset().get()).toBe(40);
    });

    it('throws PageError', () => {
      expect.assertions(1);

      const page: Page = Page.of(1);

      const stub: SinonStub = sinon.stub();

      page.getLimit = stub;
      stub.throws(new PageError('test failed'));

      expect(() => {
        page.getOffset();
      }).toThrow(PageError);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      expect.assertions(1);

      const num: number = 2;
      const page: Page = Page.of(num);

      expect(page.toString()).toBe(num.toString());
    });
  });
});
