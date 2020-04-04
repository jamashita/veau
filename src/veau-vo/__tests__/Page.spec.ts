import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { PageError } from '../../veau-error/PageError';
import { Try } from '../../veau-general/Try/Try';
import { Limit } from '../Limit';
import { Offset } from '../Offset';
import { Page } from '../Page';

describe('Page', () => {
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

      expect(offset1.get()).toEqual(0);

      const page2: Page = Page.of(2).get();
      const offset2: Offset = page2.getOffset();

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

  describe('of', () => {
    it('returns Failure when the argument is less than 1', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const trial1: Try<Page, PageError> = Page.of(0);
      const trial2: Try<Page, PageError> = Page.of(-1);

      expect(trial1.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial1.match<void>(() => {
        spy1();
      }, (e: PageError) => {
        spy2();
        expect(e).toBeInstanceOf(PageError);
      });

      trial2.match<void>(() => {
        spy3();
      }, (e: PageError) => {
        spy4();
        expect(e).toBeInstanceOf(PageError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });

    it('returns Failure when the argument is not integer', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const trial1: Try<Page, PageError> = Page.of(0.1);
      const trial2: Try<Page, PageError> = Page.of(1.5);

      expect(trial1.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial1.match<void>(() => {
        spy1();
      }, (e: PageError) => {
        spy2();
        expect(e).toBeInstanceOf(PageError);
      });

      trial2.match<void>(() => {
        spy3();
      }, (e: PageError) => {
        spy4();
        expect(e).toBeInstanceOf(PageError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });
  });
});
