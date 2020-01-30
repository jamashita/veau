import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { None } from '../None';
import { Optional } from '../Optional';
import { OptionalError } from '../OptionalError';
import { PrimitiveEqualable } from '../PrimitiveEqualable';

describe('None', () => {
  describe('get', () => {
    it('throws Error', () => {
      const none: None<PrimitiveEqualable> = None.of<PrimitiveEqualable>();

      expect(() => {
        none.get();
      }).toThrow(OptionalError);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const none: None<PrimitiveEqualable> = None.of<PrimitiveEqualable>();

      expect(none.isPresent()).toEqual(false);
    });
  });

  describe('ifPresent', () => {
    it('following function will not be invoked', () => {
      const none: None<PrimitiveEqualable> = None.of<PrimitiveEqualable>();
      const spy: SinonSpy = sinon.spy();

      none.ifPresent(() => {
        spy();
      });

      expect(spy.called).toEqual(false);
    });
  });

  describe('map', () => {
    it('following function will not be invoked', () => {
      const none: None<PrimitiveEqualable> = None.of<PrimitiveEqualable>();
      const spy: SinonSpy = sinon.spy();

      const optional: Optional<PrimitiveEqualable> = none.map<PrimitiveEqualable>((value: PrimitiveEqualable) => {
        spy();
        return value;
      });

      expect(spy.called).toEqual(false);
      expect(optional instanceof None).toEqual(true);
    });
  });

  describe('filter', () => {
    it('following function will not be invoked', () => {
      const none: None<PrimitiveEqualable> = None.of<PrimitiveEqualable>();
      const spy: SinonSpy = sinon.spy();

      const optional: Optional<PrimitiveEqualable> = none.filter((value: PrimitiveEqualable) => {
        spy();
        return true;
      });

      expect(spy.called).toEqual(false);
      expect(optional instanceof None).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const none: None<PrimitiveEqualable> = None.of<PrimitiveEqualable>();

      expect(none.toString()).toEqual('Optional<NONE>');
    });
  });
});
