import sinon, { SinonSpy } from 'sinon';
import { OffsetError } from '../../veau-error/OffsetError';
import { Try } from '../../veau-general/Try/Try';
import { Offset } from '../Offset';

describe('Offset', () => {
  describe('of', () => {
    it('returns Failure when the argument is less than 0', () => {
      const trial1: Try<Offset, OffsetError> = Offset.of(0);
      const trial2: Try<Offset, OffsetError> = Offset.of(-1);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      expect(trial1.isSuccess()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial2.match<void>(() => {
        spy1();
      }, (err: OffsetError) => {
        spy2();
        expect(err).toBeInstanceOf(OffsetError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('returns Failure when the argument is not integer', () => {
      const trial1: Try<Offset, OffsetError> = Offset.of(0.1);
      const trial2: Try<Offset, OffsetError> = Offset.of(1.5);

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(trial1.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);

      trial1.match<void>(() => {
        spy1();
      }, (err: OffsetError) => {
        spy2();
        expect(err).toBeInstanceOf(OffsetError);
      });

      trial2.match<void>(() => {
        spy3();
      }, (err: OffsetError) => {
        spy4();
        expect(err).toBeInstanceOf(OffsetError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });
  });

  describe('equals', () => {
    it('returns true i f both properties are the same', () => {
      const offset1: Offset = Offset.of(1).get();
      const offset2: Offset = Offset.of(2).get();
      const offset3: Offset = Offset.of(1).get();

      expect(offset1.equals(offset1)).toEqual(true);
      expect(offset1.equals(offset2)).toEqual(false);
      expect(offset1.equals(offset3)).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const num: number = 2;
      const offset: Offset = Offset.of(num).get();

      expect(offset.toString()).toEqual(num.toString());
    });
  });
});
