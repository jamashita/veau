import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { LimitError } from '../../veau-error/LimitError';
import { OffsetError } from '../../veau-error/OffsetError';
import { PageError } from '../../veau-error/PageError';
import { Try } from '../../veau-general/Try/Try';
import { Limit } from '../Limit';
import { Offset } from '../Offset';
import { Page } from '../Page';

describe('Page', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const page1: Try<Page, PageError> = Page.of(1);
      const page2: Try<Page, PageError> = Page.of(2);
      const page3: Try<Page, PageError> = Page.of(1);

      expect(page1.get().equals(page1.get())).toEqual(true);
      expect(page1.get().equals(page2.get())).toEqual(false);
      expect(page1.get().equals(page3.get())).toEqual(true);
    });
  });

  describe('getLimit', () => {
    it('always generates the same amount of limit', () => {
      for (let i: number = 1; i <= 10; i++) {
        const page: Try<Page, PageError> = Page.of(i);
        const limit: Try<Limit, LimitError> = page.get().getLimit();

        expect(limit.get().get()).toEqual(40);
      }
    });
  });

  describe('getOffset', () => {
    it('depends the argument which generated Offset is', () => {
      const page1: Try<Page, PageError> = Page.of(1);
      const offset1: Try<Offset, OffsetError> = page1.get().getOffset();

      expect(offset1.get().get()).toEqual(0);

      const page2: Try<Page, PageError> = Page.of(2);
      const offset2: Try<Offset, OffsetError> = page2.get().getOffset();

      expect(offset2.get().get()).toEqual(40);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 2;
      const page: Try<Page, PageError> = Page.of(num);

      expect(page.get().toString()).toEqual(num.toString());
    });
  });

  describe('of', () => {
    it('throws PageError when the argument is less than 1', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const page1: Try<Page, PageError> = Page.of(0);
      const page2: Try<Page, PageError> = Page.of(-1);

      expect(page1.isFailure()).toEqual(true);
      expect(page2.isFailure()).toEqual(true);

      page1.match<void>(() => {
        spy1();
      }, (e: PageError) => {
        spy2();
        expect(e).toBeInstanceOf(PageError);
      });

      page2.match<void>(() => {
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

    it('throw PageError when the argument is not integer', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const page1: Try<Page, PageError> = Page.of(0.1);
      const page2: Try<Page, PageError> = Page.of(1.5);

      expect(page1.isFailure()).toEqual(true);
      expect(page2.isFailure()).toEqual(true);

      page1.match<void>(() => {
        spy1();
      }, (e: PageError) => {
        spy2();
        expect(e).toBeInstanceOf(PageError);
      });

      page2.match<void>(() => {
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
