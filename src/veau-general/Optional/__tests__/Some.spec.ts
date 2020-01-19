import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { None } from '../None';
import { Optional } from '../Optional';
import { Some } from '../Some';

describe('Some', () => {
  describe('get', () => {
    it('the value is got by get method', () => {
      const some1: Some<number> = Some.of<number>(1);
      const some2: Some<number> = Some.of<number>(0);
      const some3: Some<number> = Some.of<number>(-1);
      const some4: Some<string> = Some.of<string>('');
      const some5: Some<string> = Some.of<string>('1');
      const some6: Some<boolean> = Some.of<boolean>(true);
      const some7: Some<boolean> = Some.of<boolean>(false);
      const some8: Some<object> = Some.of<object>({});
      const some9: Some<object> = Some.of<object>([]);

      expect(some1.get()).toEqual(1);
      expect(some2.get()).toEqual(0);
      expect(some3.get()).toEqual(-1);
      expect(some4.get()).toEqual('');
      expect(some5.get()).toEqual('1');
      expect(some6.get()).toEqual(true);
      expect(some7.get()).toEqual(false);
      expect(some8.get()).toEqual({});
      expect(some9.get()).toEqual([]);
    });
  });

  describe('isPresent', () => {
    it('returns true', () => {
      const some1: Some<number> = Some.of<number>(1);
      const some2: Some<number> = Some.of<number>(0);
      const some3: Some<number> = Some.of<number>(-1);
      const some4: Some<string> = Some.of<string>('');
      const some5: Some<string> = Some.of<string>('1');
      const some6: Some<boolean> = Some.of<boolean>(true);
      const some7: Some<boolean> = Some.of<boolean>(false);
      const some8: Some<object> = Some.of<object>({});
      const some9: Some<object> = Some.of<object>([]);

      expect(some1.isPresent()).toEqual(true);
      expect(some2.isPresent()).toEqual(true);
      expect(some3.isPresent()).toEqual(true);
      expect(some4.isPresent()).toEqual(true);
      expect(some5.isPresent()).toEqual(true);
      expect(some6.isPresent()).toEqual(true);
      expect(some7.isPresent()).toEqual(true);
      expect(some8.isPresent()).toEqual(true);
      expect(some9.isPresent()).toEqual(true);
    });
  });

  describe('ifPresent', () => {
    it('following function is called', () => {
      const some: Some<number> = Some.of<number>(1);
      const spy: SinonSpy = sinon.spy();

      some.ifPresent((value: number) => {
        spy();
      });

      expect(spy.called).toEqual(true);
    });
  });

  describe('map', () => {
    it('following function is called', () => {
      const some: Some<number> = Some.of<number>(1);
      const spy: SinonSpy = sinon.spy();

      const optional: Optional<number> = some.map<number>((value: number) => {
        spy();
        return value * 2;
      });

      expect(spy.called).toEqual(true);
      expect(optional.isPresent()).toEqual(true);
      expect(optional.get()).toEqual(2);
    });
  });

  describe('filter', () => {
    it('following function is called', () => {
      const some1: Some<number> = Some.of<number>(1);
      const some2: Some<number> = Some.of<number>(2);

      const optional1: Optional<number> = some1.filter((value: number) => {
        if (value % 2 === 0) {
          return true;
        }

        return false;
      });
      const optional2: Optional<number> = some2.filter((value: number) => {
        if (value % 2 === 0) {
          return true;
        }

        return false;
      });

      expect(optional1 instanceof None).toEqual(true);
      expect(optional2 instanceof Some).toEqual(true);
      expect(optional1.isPresent()).toEqual(false);
      expect(optional2.isPresent()).toEqual(true);
      expect(optional2.get()).toEqual(2);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const some1: Some<number> = Some.of<number>(1);
      const some2: Some<number> = Some.of<number>(0);
      const some3: Some<number> = Some.of<number>(-1);
      const some4: Some<string> = Some.of<string>('');
      const some5: Some<string> = Some.of<string>('1');
      const some6: Some<boolean> = Some.of<boolean>(true);
      const some7: Some<boolean> = Some.of<boolean>(false);
      const some8: Some<object> = Some.of<object>({});
      const some9: Some<object> = Some.of<object>([]);

      expect(some1.toString()).toEqual('Optional<1>');
      expect(some2.toString()).toEqual('Optional<0>');
      expect(some3.toString()).toEqual('Optional<-1>');
      expect(some4.toString()).toEqual('Optional<>');
      expect(some5.toString()).toEqual('Optional<1>');
      expect(some6.toString()).toEqual('Optional<true>');
      expect(some7.toString()).toEqual('Optional<false>');
      expect(some8.toString()).toEqual('Optional<[object Object]>');
      expect(some9.toString()).toEqual('Optional<>');
    });
  });
});
