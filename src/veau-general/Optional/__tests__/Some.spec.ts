import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { None } from '../None';
import { Optional } from '../Optional';
import { PrimitiveEqualable } from '../PrimitiveEqualable';
import { Some } from '../Some';

describe('Some', () => {
  describe('get', () => {
    it('the value is got by get method', () => {
      const some1: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(1));
      const some2: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(0));
      const some3: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(-1));
      const some4: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(''));
      const some5: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of('1'));
      const some6: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(true));
      const some7: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(false));

      expect(some1.get().get()).toEqual(1);
      expect(some2.get().get()).toEqual(0);
      expect(some3.get().get()).toEqual(-1);
      expect(some4.get().get()).toEqual('');
      expect(some5.get().get()).toEqual('1');
      expect(some6.get().get()).toEqual(true);
      expect(some7.get().get()).toEqual(false);
    });
  });

  describe('isPresent', () => {
    it('returns true', () => {
      const some1: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(1));
      const some2: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(0));
      const some3: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(-1));
      const some4: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(''));
      const some5: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of('1'));
      const some6: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(true));
      const some7: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(false));

      expect(some1.isPresent()).toEqual(true);
      expect(some2.isPresent()).toEqual(true);
      expect(some3.isPresent()).toEqual(true);
      expect(some4.isPresent()).toEqual(true);
      expect(some5.isPresent()).toEqual(true);
      expect(some6.isPresent()).toEqual(true);
      expect(some7.isPresent()).toEqual(true);
    });
  });

  describe('ifPresent', () => {
    it('following function is called', () => {
      const some: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(1));
      const spy: SinonSpy = sinon.spy();

      some.ifPresent((value: PrimitiveEqualable) => {
        spy();
      });

      expect(spy.called).toEqual(true);
    });
  });

  describe('map', () => {
    it('following function is called', () => {
      const some: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(1));
      const spy: SinonSpy = sinon.spy();

      const optional: Optional<PrimitiveEqualable> = some.map<PrimitiveEqualable>((value: PrimitiveEqualable) => {
        spy();
        return PrimitiveEqualable.of(value.get() as number * 2);
      });

      expect(spy.called).toEqual(true);
      expect(optional.isPresent()).toEqual(true);
      expect(optional.get().get()).toEqual(2);
    });
  });

  describe('filter', () => {
    it('following function is called', () => {
      const some1: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(1));
      const some2: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(2));

      const optional1: Optional<PrimitiveEqualable> = some1.filter((value: PrimitiveEqualable) => {
        if (value.get() as number % 2 === 0) {
          return true;
        }

        return false;
      });
      const optional2: Optional<PrimitiveEqualable> = some2.filter((value: PrimitiveEqualable) => {
        if (value.get() as number % 2 === 0) {
          return true;
        }

        return false;
      });

      expect(optional1 instanceof None).toEqual(true);
      expect(optional2 instanceof Some).toEqual(true);
      expect(optional1.isPresent()).toEqual(false);
      expect(optional2.isPresent()).toEqual(true);
      expect(optional2.get().get()).toEqual(2);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const some1: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(1));
      const some2: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(0));
      const some3: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(-1));
      const some4: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(''));
      const some5: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of('1'));
      const some6: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(true));
      const some7: Some<PrimitiveEqualable> = Some.of<PrimitiveEqualable>(PrimitiveEqualable.of(false));

      expect(some1.toString()).toEqual('Optional<1>');
      expect(some2.toString()).toEqual('Optional<0>');
      expect(some3.toString()).toEqual('Optional<-1>');
      expect(some4.toString()).toEqual('Optional<>');
      expect(some5.toString()).toEqual('Optional<1>');
      expect(some6.toString()).toEqual('Optional<true>');
      expect(some7.toString()).toEqual('Optional<false>');
    });
  });
});
