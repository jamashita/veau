import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { HeaderSizeError } from '../../veau-error/HeaderSizeError';
import { Try } from '../../veau-general/Try/Try';
import { HeaderSize } from '../HeaderSize';

describe('HeaderSize', () => {
  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const size1: Try<HeaderSize, HeaderSizeError> = HeaderSize.of(10);
      const size2: Try<HeaderSize, HeaderSizeError> = HeaderSize.of(20);
      const size3: Try<HeaderSize, HeaderSizeError> = HeaderSize.of(10);

      expect(size1.get().equals(size1.get())).toEqual(true);
      expect(size1.get().equals(size2.get())).toEqual(false);
      expect(size1.get().equals(size3.get())).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const size: number = 10;
      const headerSize: Try<HeaderSize, HeaderSizeError> = HeaderSize.of(size);

      expect(headerSize.get().toString()).toEqual(size.toString());
    });
  });

  describe('of', () => {
    it('throws HeaderSizeError when the argument is less than 0', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const size1: Try<HeaderSize, HeaderSizeError> = HeaderSize.of(0);
      const size2: Try<HeaderSize, HeaderSizeError> = HeaderSize.of(-1);

      expect(size1.isSuccess()).toEqual(true);
      expect(size2.isFailure()).toEqual(true);

      size2.match<void>(() => {
        spy1();
      }, (e: HeaderSizeError) => {
        spy2();
        expect(e).toBeInstanceOf(HeaderSizeError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws HeaderSizeError when the argument is not integer', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const size1: Try<HeaderSize, HeaderSizeError> = HeaderSize.of(0.1);
      const size2: Try<HeaderSize, HeaderSizeError> = HeaderSize.of(1.5);

      expect(size1.isFailure()).toEqual(true);
      expect(size2.isFailure()).toEqual(true);

      size1.match<void>(() => {
        spy1();
      }, (e: HeaderSizeError) => {
        spy2();
        expect(e).toBeInstanceOf(HeaderSizeError);
      });

      size2.match<void>(() => {
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
