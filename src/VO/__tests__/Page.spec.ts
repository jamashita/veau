import sinon, { SinonSpy } from 'sinon';
import { PageError } from '../../Error/PageError';
import { Try } from '../../General/Superposition/Try';
import { Limit } from '../Limit';
import { Offset } from '../Offset';
import { Page } from '../Page';

// DONE
describe('Page', () => {
  describe('min', () => {
    it('always returns 1', () => {
      expect(Page.min().get()).toEqual(1);
    });

    it('returns singleton instance', () => {
      expect(Page.min()).toBe(Page.min());
    });
  });

  describe('of', () => {
    it('returns Failure when the argument is less than 1', () => {
      const trial1: Try<Page, PageError> = Page.of(0);
      const trial2: Try<Page, PageError> = Page.of(-1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(trial1.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial1.match<void>(() => {
        spy1();
      }, (err: PageError) => {
        spy2();
        expect(err).toBeInstanceOf(PageError);
      });

      trial2.match<void>(() => {
        spy3();
      }, (err: PageError) => {
        spy4();
        expect(err).toBeInstanceOf(PageError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });

    it('returns Success and its value is Page.min() when the argument 1', () => {
      const trial: Try<Page, PageError> = Page.of(1);

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get()).toBe(Page.min());
    });

    it('returns Failure when the argument is not integer', () => {
      const trial1: Try<Page, PageError> = Page.of(0.1);
      const trial2: Try<Page, PageError> = Page.of(1.5);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(trial1.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial1.match<void>(() => {
        spy1();
      }, (err: PageError) => {
        spy2();
        expect(err).toBeInstanceOf(PageError);
      });

      trial2.match<void>(() => {
        spy3();
      }, (err: PageError) => {
        spy4();
        expect(err).toBeInstanceOf(PageError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });

    it('normal case', () => {
      const page1: number = 1;
      const page2: number = 4;
      const trial1: Try<Page, PageError> = Page.of(page1);
      const trial2: Try<Page, PageError> = Page.of(page2);

      expect(trial1.isSuccess()).toEqual(true);
      expect(trial2.isSuccess()).toEqual(true);

      expect(trial1.get().get()).toEqual(page1);
      expect(trial2.get().get()).toEqual(page2);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const page1: Page = Page.of(1).get();
      const page2: Page = Page.of(2).get();
      const page3: Page = Page.of(1).get();

      expect(page1.equals(page1)).toEqual(true);
      expect(page1.equals(page2)).toEqual(false);
      expect(page1.equals(page3)).toEqual(true);
    });
  });

  describe('getLimit', () => {
    it('always generates the same amount of limit', () => {
      for (let i: number = 1; i <= 10; i++) {
        const page: Page = Page.of(i).get();
        const limit: Limit = page.getLimit();

        expect(limit.get()).toEqual(40);
      }
    });
  });

  describe('getOffset', () => {
    it('depends the argument which generated Offset is', () => {
      const page1: Page = Page.of(1).get();
      const offset1: Offset = page1.getOffset();
      const page2: Page = Page.of(2).get();
      const offset2: Offset = page2.getOffset();

      expect(offset1.get()).toEqual(0);
      expect(offset2.get()).toEqual(40);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 2;
      const page: Page = Page.of(num).get();

      expect(page.toString()).toEqual(num.toString());
    });
  });
});
