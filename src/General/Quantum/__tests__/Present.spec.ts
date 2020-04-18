import sinon, { SinonSpy } from 'sinon';
import { Superposition } from '../../Superposition/Superposition';
import { Absent } from '../Absent';
import { Present } from '../Present';
import { Quantum } from '../Quantum';
import { QuantumError } from '../QuantumError';

describe('Present', () => {
  describe('get', () => {
    it('the value is got by get method', () => {
      const present1: Present<number> = Present.of<number>(1);
      const present2: Present<number> = Present.of<number>(0);
      const present3: Present<number> = Present.of<number>(-1);
      const present4: Present<string> = Present.of<string>('');
      const present5: Present<string> = Present.of<string>('1');
      const present6: Present<boolean> = Present.of<boolean>(true);
      const present7: Present<boolean> = Present.of<boolean>(false);

      expect(present1.get()).toEqual(1);
      expect(present2.get()).toEqual(0);
      expect(present3.get()).toEqual(-1);
      expect(present4.get()).toEqual('');
      expect(present5.get()).toEqual('1');
      expect(present6.get()).toEqual(true);
      expect(present7.get()).toEqual(false);
    });
  });

  describe('isPresent', () => {
    it('returns true', () => {
      const present1: Present<number> = Present.of<number>(1);
      const present2: Present<number> = Present.of<number>(0);
      const present3: Present<number> = Present.of<number>(-1);
      const present4: Present<string> = Present.of<string>('');
      const present5: Present<string> = Present.of<string>('1');
      const present6: Present<boolean> = Present.of<boolean>(true);
      const present7: Present<boolean> = Present.of<boolean>(false);

      expect(present1.isPresent()).toEqual(true);
      expect(present2.isPresent()).toEqual(true);
      expect(present3.isPresent()).toEqual(true);
      expect(present4.isPresent()).toEqual(true);
      expect(present5.isPresent()).toEqual(true);
      expect(present6.isPresent()).toEqual(true);
      expect(present7.isPresent()).toEqual(true);
    });
  });

  describe('isAbsent', () => {
    it('returns false', () => {
      const present1: Present<number> = Present.of<number>(1);
      const present2: Present<number> = Present.of<number>(0);
      const present3: Present<number> = Present.of<number>(-1);
      const present4: Present<string> = Present.of<string>('');
      const present5: Present<string> = Present.of<string>('1');
      const present6: Present<boolean> = Present.of<boolean>(true);
      const present7: Present<boolean> = Present.of<boolean>(false);

      expect(present1.isAbsent()).toEqual(false);
      expect(present2.isAbsent()).toEqual(false);
      expect(present3.isAbsent()).toEqual(false);
      expect(present4.isAbsent()).toEqual(false);
      expect(present5.isAbsent()).toEqual(false);
      expect(present6.isAbsent()).toEqual(false);
      expect(present7.isAbsent()).toEqual(false);
    });
  });

  describe('ifPresent', () => {
    it('consumer will be invoked', () => {
      const value: number = 5398;
      const present: Present<number> = Present.of<number>(value);

      const spy1: SinonSpy = sinon.spy();

      present.ifPresent((v: number) => {
        expect(v).toEqual(value);
        spy1();
      });

      expect(spy1.called).toEqual(true);
    });

    it('consumer will be invoked asynchronously', async () => {
      const value: number = 329853;
      const present: Present<number> = Present.of<number>(value);

      const spy1: SinonSpy = sinon.spy();

      await present.ifPresent(async (v: number) => {
        expect(v).toEqual(value);
        spy1();
      });

      expect(spy1.called).toEqual(true);
    });
  });

  describe('map', () => {
    it('following function is called', () => {
      const present: Present<number> = Present.of<number>(10);

      const spy: SinonSpy = sinon.spy();

      const quantum: Quantum<number> = present.map<number>((value: number) => {
        spy();
        return value * 2;
      });

      expect(spy.called).toEqual(true);
      expect(quantum.isPresent()).toEqual(true);
      expect(quantum.get()).toEqual(10 * 2);
    });

    it('returns Absent when function returns null', () => {
      const present: Present<number> = Present.of<number>(1);

      const spy: SinonSpy = sinon.spy();

      const quantum: Quantum<number> = present.map<number>(() => {
        spy();
        return null;
      });

      expect(spy.called).toEqual(true);
      expect(quantum.isAbsent()).toEqual(true);
    });

    it('returns Absent when function returns undefined', () => {
      const present: Present<number> = Present.of<number>(1);

      const spy: SinonSpy = sinon.spy();

      const quantum: Quantum<number> = present.map<number>(() => {
        spy();
        return undefined;
      });

      expect(spy.called).toEqual(true);
      expect(quantum.isAbsent()).toEqual(true);
    });
  });

  describe('toSuperposition', () => {
    it('returns Success', () => {
      const present: Present<number> = Present.of<number>(1);

      const superposition: Superposition<number, QuantumError> = present.toSuperposition();

      expect(superposition.isSuccess()).toEqual(true);
    });
  });

  describe('filter', () => {
    it('following function is called', () => {
      const present1: Present<number> = Present.of<number>(1);
      const present2: Present<number> = Present.of<number>(2);

      const quantum1: Quantum<number> = present1.filter((value: number) => {
        if (value % 2 === 0) {
          return true;
        }

        return false;
      });
      const quantum2: Quantum<number> = present2.filter((value: number) => {
        if (value % 2 === 0) {
          return true;
        }

        return false;
      });

      expect(quantum1).toBeInstanceOf(Absent);
      expect(quantum2).toBeInstanceOf(Present);
      expect(quantum1.isAbsent()).toEqual(true);
      expect(quantum2.isPresent()).toEqual(true);
      expect(quantum2.get()).toEqual(2);
    });
  });
});
