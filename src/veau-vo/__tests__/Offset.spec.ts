import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { OffsetError } from '../../veau-error/OffsetError';
import { Try } from '../../veau-general/Try/Try';
import { Offset } from '../Offset';

describe('Offset', () => {
  describe('equals', () => {
    it('returns true i f both properties are the same', () => {
      const offset1: Try<Offset, OffsetError> = Offset.of(1);
      const offset2: Try<Offset, OffsetError> = Offset.of(2);
      const offset3: Try<Offset, OffsetError> = Offset.of(1);

      expect(offset1.get().equals(offset1.get())).toEqual(true);
      expect(offset1.get().equals(offset2.get())).toEqual(false);
      expect(offset1.get().equals(offset3.get())).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 2;
      const offset: Try<Offset, OffsetError> = Offset.of(num);

      expect(offset.get().toString()).toEqual(num.toString());
    });
  });

  describe('of', () => {
    it('throws OffsetError when the argument is less than 0', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const offset1: Try<Offset, OffsetError> = Offset.of(0);
      const offset2: Try<Offset, OffsetError> = Offset.of(-1);

      expect(offset1.isSuccess()).toEqual(true);
      expect(offset2.isFailure()).toEqual(true);

      offset2.match<void>(() => {
        spy1();
      }, (e: OffsetError) => {
        spy2();
        expect(e).toBeInstanceOf(OffsetError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('throws OffsetError when the argument is not integer', () => {
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      const offset1: Try<Offset, OffsetError> = Offset.of(0.1);
      const offset2: Try<Offset, OffsetError> = Offset.of(1.5);

      expect(offset1.isFailure()).toEqual(true);
      expect(offset2.isFailure()).toEqual(true);

      offset1.match<void>(() => {
        spy1();
      }, (e: OffsetError) => {
        spy2();
        expect(e).toBeInstanceOf(OffsetError);
      });

      offset2.match<void>(() => {
        spy3();
      }, (e: OffsetError) => {
        spy4();
        expect(e).toBeInstanceOf(OffsetError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });
  });
});
