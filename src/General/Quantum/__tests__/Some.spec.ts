import sinon, { SinonSpy } from 'sinon';
import { Try } from '../../Try/Try';
import { None } from '../None';
import { Quantum } from '../Quantum';
import { QuantumError } from '../QuantumError';
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

      expect(some1.get()).toEqual(1);
      expect(some2.get()).toEqual(0);
      expect(some3.get()).toEqual(-1);
      expect(some4.get()).toEqual('');
      expect(some5.get()).toEqual('1');
      expect(some6.get()).toEqual(true);
      expect(some7.get()).toEqual(false);
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

      expect(some1.isPresent()).toEqual(true);
      expect(some2.isPresent()).toEqual(true);
      expect(some3.isPresent()).toEqual(true);
      expect(some4.isPresent()).toEqual(true);
      expect(some5.isPresent()).toEqual(true);
      expect(some6.isPresent()).toEqual(true);
      expect(some7.isPresent()).toEqual(true);
    });
  });

  describe('isAbsent', () => {
    it('returns false', () => {
      const some1: Some<number> = Some.of<number>(1);
      const some2: Some<number> = Some.of<number>(0);
      const some3: Some<number> = Some.of<number>(-1);
      const some4: Some<string> = Some.of<string>('');
      const some5: Some<string> = Some.of<string>('1');
      const some6: Some<boolean> = Some.of<boolean>(true);
      const some7: Some<boolean> = Some.of<boolean>(false);

      expect(some1.isAbsent()).toEqual(false);
      expect(some2.isAbsent()).toEqual(false);
      expect(some3.isAbsent()).toEqual(false);
      expect(some4.isAbsent()).toEqual(false);
      expect(some5.isAbsent()).toEqual(false);
      expect(some6.isAbsent()).toEqual(false);
      expect(some7.isAbsent()).toEqual(false);
    });
  });

  describe('ifPresent', () => {
    it('consumer will be invoked', () => {
      const value: number = 5398;
      const some: Some<number> = Some.of<number>(value);

      const spy1: SinonSpy = sinon.spy();

      some.ifPresent((v: number) => {
        expect(v).toEqual(value);
        spy1();
      });

      expect(spy1.called).toEqual(true);
    });

    it('consumer will be invoked asynchronously', async () => {
      const value: number = 329853;
      const some: Some<number> = Some.of<number>(value);

      const spy1: SinonSpy = sinon.spy();

      await some.ifPresent(async (v: number) => {
        expect(v).toEqual(value);
        spy1();
      });

      expect(spy1.called).toEqual(true);
    });
  });

  describe('map', () => {
    it('following function is called', () => {
      const some: Some<number> = Some.of<number>(10);

      const spy: SinonSpy = sinon.spy();

      const optional: Quantum<number> = some.map<number>((value: number) => {
        spy();
        return value * 2;
      });

      expect(spy.called).toEqual(true);
      expect(optional.isPresent()).toEqual(true);
      expect(optional.get()).toEqual(10 * 2);
    });

    it('returns None when function returns null', () => {
      const some: Some<number> = Some.of<number>(1);

      const spy: SinonSpy = sinon.spy();

      const optional: Quantum<number> = some.map<number>(() => {
        spy();
        return null;
      });

      expect(spy.called).toEqual(true);
      expect(optional.isAbsent()).toEqual(true);
    });

    it('returns None when function returns undefined', () => {
      const some: Some<number> = Some.of<number>(1);

      const spy: SinonSpy = sinon.spy();

      const optional: Quantum<number> = some.map<number>(() => {
        spy();
        return undefined;
      });

      expect(spy.called).toEqual(true);
      expect(optional.isAbsent()).toEqual(true);
    });
  });

  describe('toTry', () => {
    it('returns Success', () => {
      const some: Some<number> = Some.of<number>(1);

      const trial: Try<number, QuantumError> = some.toTry();

      expect(trial.isSuccess()).toEqual(true);
    });
  });

  describe('filter', () => {
    it('following function is called', () => {
      const some1: Some<number> = Some.of<number>(1);
      const some2: Some<number> = Some.of<number>(2);

      const optional1: Quantum<number> = some1.filter((value: number) => {
        if (value % 2 === 0) {
          return true;
        }

        return false;
      });
      const optional2: Quantum<number> = some2.filter((value: number) => {
        if (value % 2 === 0) {
          return true;
        }

        return false;
      });

      expect(optional1).toBeInstanceOf(None);
      expect(optional2).toBeInstanceOf(Some);
      expect(optional1.isAbsent()).toEqual(true);
      expect(optional2.isPresent()).toEqual(true);
      expect(optional2.get()).toEqual(2);
    });
  });
});
