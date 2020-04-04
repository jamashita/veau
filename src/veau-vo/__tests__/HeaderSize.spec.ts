import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { HeaderSizeError } from '../../veau-error/HeaderSizeError';
import { Try } from '../../veau-general/Try/Try';
import { HeaderSize } from '../HeaderSize';

describe('HeaderSize', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const size1: HeaderSize = HeaderSize.of(10).get();
      const size2: HeaderSize = HeaderSize.of(20).get();
      const size3: HeaderSize = HeaderSize.of(10).get();

      expect(size1.equals(size1)).toEqual(true);
      expect(size1.equals(size2)).toEqual(false);
      expect(size1.equals(size3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const size: number = 10;
      const headerSize: HeaderSize = HeaderSize.of(size).get();

      expect(headerSize.toString()).toEqual(headerSize.toString());
    });
  });

  describe('of', () => {
    it('returns Failure when the argument is less than 0', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const trial1: Try<HeaderSize, HeaderSizeError> = HeaderSize.of(0);
      const trial2: Try<HeaderSize, HeaderSizeError> = HeaderSize.of(-1);

      expect(trial1.isSuccess()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial2.match<void>(() => {
        spy1();
      }, (e: HeaderSizeError) => {
        spy2();
        expect(e).toBeInstanceOf(HeaderSizeError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when the argument is not integer', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const trial1: Try<HeaderSize, HeaderSizeError> = HeaderSize.of(0.1);
      const trial2: Try<HeaderSize, HeaderSizeError> = HeaderSize.of(1.5);

      expect(trial1.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial1.match<void>(() => {
        spy1();
      }, (e: HeaderSizeError) => {
        spy2();
        expect(e).toBeInstanceOf(HeaderSizeError);
      });

      trial2.match<void>(() => {
        spy3();
      }, (e: HeaderSizeError) => {
        spy4();
        expect(e).toBeInstanceOf(HeaderSizeError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });
  });
});
