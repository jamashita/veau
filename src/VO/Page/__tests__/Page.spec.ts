import sinon, { SinonSpy } from 'sinon';

import { Superposition } from '@jamashita/publikum-monad';

import { PageError } from '../Error/PageError';
import { Limit } from '../Limit';
import { Offset } from '../Offset';
import { Page } from '../Page';

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
      const superposition1: Superposition<Page, PageError> = Page.of(0);
      const superposition2: Superposition<Page, PageError> = Page.of(-1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(superposition1.isDead()).toBe(true);
      expect(superposition2.isDead()).toBe(true);

      superposition1.match<void>(
        () => {
          spy1();
        },
        (err: PageError) => {
          spy2();
          expect(err).toBeInstanceOf(PageError);
        }
      );

      superposition2.match<void>(
        () => {
          spy3();
        },
        (err: PageError) => {
          spy4();
          expect(err).toBeInstanceOf(PageError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('returns Alive and its value is Page.min() when the argument 1', () => {
      const superposition: Superposition<Page, PageError> = Page.of(1);

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(Page.min());
    });

    it('returns Dead when the argument is not integer', () => {
      const superposition1: Superposition<Page, PageError> = Page.of(0.1);
      const superposition2: Superposition<Page, PageError> = Page.of(1.5);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(superposition1.isDead()).toBe(true);
      expect(superposition2.isDead()).toBe(true);

      superposition1.match<void>(
        () => {
          spy1();
        },
        (err: PageError) => {
          spy2();
          expect(err).toBeInstanceOf(PageError);
        }
      );

      superposition2.match<void>(
        () => {
          spy3();
        },
        (err: PageError) => {
          spy4();
          expect(err).toBeInstanceOf(PageError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
      expect(spy3.called).toBe(false);
      expect(spy4.called).toBe(true);
    });

    it('normal case', () => {
      const page1: number = 1;
      const page2: number = 4;
      const superposition1: Superposition<Page, PageError> = Page.of(page1);
      const superposition2: Superposition<Page, PageError> = Page.of(page2);

      expect(superposition1.isAlive()).toBe(true);
      expect(superposition2.isAlive()).toBe(true);

      expect(superposition1.get().get()).toBe(page1);
      expect(superposition2.get().get()).toBe(page2);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const page1: Page = Page.of(1).get();
      const page2: Page = Page.of(2).get();
      const page3: Page = Page.of(1).get();

      expect(page1.equals(page1)).toBe(true);
      expect(page1.equals(page2)).toBe(false);
      expect(page1.equals(page3)).toBe(true);
    });
  });

  describe('getLimit', () => {
    it('always generates the same amount of limit', () => {
      for (let i: number = 1; i <= 10; i++) {
        const page: Page = Page.of(i).get();
        const limit: Limit = page.getLimit();

        expect(limit.get()).toBe(40);
      }
    });
  });

  describe('getOffset', () => {
    it('depends the argument which generated Offset is', () => {
      const page1: Page = Page.of(1).get();
      const offset1: Offset = page1.getOffset();
      const page2: Page = Page.of(2).get();
      const offset2: Offset = page2.getOffset();

      expect(offset1.get()).toBe(0);
      expect(offset2.get()).toBe(40);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 2;
      const page: Page = Page.of(num).get();

      expect(page.toString()).toBe(num.toString());
    });
  });
});
