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

      expect(present1.get()).toBe(1);
      expect(present2.get()).toBe(0);
      expect(present3.get()).toBe(-1);
      expect(present4.get()).toBe('');
      expect(present5.get()).toBe('1');
      expect(present6.get()).toBe(true);
      expect(present7.get()).toBe(false);
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

      expect(present1.isPresent()).toBe(true);
      expect(present2.isPresent()).toBe(true);
      expect(present3.isPresent()).toBe(true);
      expect(present4.isPresent()).toBe(true);
      expect(present5.isPresent()).toBe(true);
      expect(present6.isPresent()).toBe(true);
      expect(present7.isPresent()).toBe(true);
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

      expect(present1.isAbsent()).toBe(false);
      expect(present2.isAbsent()).toBe(false);
      expect(present3.isAbsent()).toBe(false);
      expect(present4.isAbsent()).toBe(false);
      expect(present5.isAbsent()).toBe(false);
      expect(present6.isAbsent()).toBe(false);
      expect(present7.isAbsent()).toBe(false);
    });
  });

  describe('ifPresent', () => {
    it('consumer will be invoked', () => {
      const value: number = 5398;
      const present: Present<number> = Present.of<number>(value);

      const spy1: SinonSpy = sinon.spy();

      present.ifPresent((v: number) => {
        expect(v).toBe(value);
        spy1();
      });

      expect(spy1.called).toBe(true);
    });

    it('consumer will be invoked asynchronously', async () => {
      const value: number = 329853;
      const present: Present<number> = Present.of<number>(value);

      const spy1: SinonSpy = sinon.spy();

      await present.ifPresent(async (v: number) => {
        expect(v).toBe(value);
        spy1();
      });

      expect(spy1.called).toBe(true);
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

      expect(spy.called).toBe(true);
      expect(quantum.isPresent()).toBe(true);
      expect(quantum.get()).toBe(10 * 2);
    });

    it('returns Absent when function returns null', () => {
      const present: Present<number> = Present.of<number>(1);

      const spy: SinonSpy = sinon.spy();

      const quantum: Quantum<number> = present.map<number>(() => {
        spy();
        return null;
      });

      expect(spy.called).toBe(true);
      expect(quantum.isAbsent()).toBe(true);
    });

    it('returns Absent when function returns undefined', () => {
      const present: Present<number> = Present.of<number>(1);

      const spy: SinonSpy = sinon.spy();

      const quantum: Quantum<number> = present.map<number>(() => {
        spy();
        return undefined;
      });

      expect(spy.called).toBe(true);
      expect(quantum.isAbsent()).toBe(true);
    });
  });

  describe('toSuperposition', () => {
    it('returns Success', () => {
      const present: Present<number> = Present.of<number>(1);

      const superposition: Superposition<number, QuantumError> = present.toSuperposition();

      expect(superposition.isSuccess()).toBe(true);
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
      expect(quantum1.isAbsent()).toBe(true);
      expect(quantum2.isPresent()).toBe(true);
      expect(quantum2.get()).toBe(2);
    });
  });
});
