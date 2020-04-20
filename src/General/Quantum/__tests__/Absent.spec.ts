import sinon, { SinonSpy } from 'sinon';
import { Superposition } from '../../Superposition/Superposition';
import { Absent } from '../Absent';
import { Quantum } from '../Quantum';
import { QuantumError } from '../QuantumError';

describe('Absent', () => {
  describe('get', () => {
    it('throws QuantumError', () => {
      const absent1: Absent<void> = Absent.of();
      const absent2: Absent<number> = Absent.of<number>();

      expect(() => {
        absent1.get();
      }).toThrow(QuantumError);
      expect(() => {
        absent2.get();
      }).toThrow(QuantumError);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const absent1: Absent<void> = Absent.of();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isPresent()).toBe(false);
      expect(absent2.isPresent()).toBe(false);
    });
  });

  describe('isAbsent', () => {
    it('returns true', () => {
      const absent1: Absent<void> = Absent.of();
      const absent2: Absent<number> = Absent.of<number>();

      expect(absent1.isAbsent()).toBe(true);
      expect(absent2.isAbsent()).toBe(true);
    });
  });

  describe('ifPresent', () => {
    it('consumer will not be invoked', () => {
      const absent: Absent<number> = Absent.of<number>();

      const spy1: SinonSpy = sinon.spy();

      absent.ifPresent(() => {
        spy1();
      });

      expect(spy1.called).toBe(false);
    });

    it('consumer is not invoked asynchronously ', async () => {
      const absent: Absent<number> = Absent.of<number>();

      const spy1: SinonSpy = sinon.spy();

      await absent.ifPresent(async () => {
        spy1();
      });

      expect(spy1.called).toBe(false);
    });
  });

  describe('map', () => {
    it('following function will not be invoked', () => {
      const absent: Absent<number> = Absent.of<number>();

      const spy: SinonSpy = sinon.spy();

      const quantum: Quantum<number> = absent.map<number>((value: number) => {
        spy();
        return value;
      });

      expect(spy.called).toBe(false);
      expect(quantum).toBeInstanceOf(Absent);
    });
  });

  describe('toSuperposition', () => {
    it('returns Failure', () => {
      const absent: Absent<number> = Absent.of<number>();

      const superposition: Superposition<number, QuantumError> = absent.toSuperposition();

      expect(superposition.isFailure()).toBe(true);
    });
  });

  describe('filter', () => {
    it('following function will not be invoked', () => {
      const absent: Absent<number> = Absent.of<number>();

      const spy: SinonSpy = sinon.spy();

      const quantum: Quantum<number> = absent.filter((value: number) => {
        spy();
        return true;
      });

      expect(spy.called).toBe(false);
      expect(absent).toBe(quantum);
    });
  });
});
