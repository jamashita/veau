import sinon, { SinonSpy } from 'sinon';
import { Try } from '../../Superposition/Try';
import { None } from '../None';
import { Quantum } from '../Quantum';
import { QuantumError } from '../QuantumError';

describe('None', () => {
  describe('get', () => {
    it('throws QuantumError', () => {
      const none1: None<void> = None.of();
      const none2: None<number> = None.of<number>();

      expect(() => {
        none1.get();
      }).toThrow(QuantumError);
      expect(() => {
        none2.get();
      }).toThrow(QuantumError);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const none1: None<void> = None.of();
      const none2: None<number> = None.of<number>();

      expect(none1.isPresent()).toEqual(false);
      expect(none2.isPresent()).toEqual(false);
    });
  });

  describe('isAbsent', () => {
    it('returns true', () => {
      const none1: None<void> = None.of();
      const none2: None<number> = None.of<number>();

      expect(none1.isAbsent()).toEqual(true);
      expect(none2.isAbsent()).toEqual(true);
    });
  });

  describe('ifPresent', () => {
    it('consumer will not be invoked', () => {
      const none: None<number> = None.of<number>();

      const spy1: SinonSpy = sinon.spy();

      none.ifPresent(() => {
        spy1();
      });

      expect(spy1.called).toEqual(false);
    });

    it('consumer is not invoked asynchronously ', async () => {
      const none: None<number> = None.of<number>();

      const spy1: SinonSpy = sinon.spy();

      await none.ifPresent(async () => {
        spy1();
      });

      expect(spy1.called).toEqual(false);
    });
  });

  describe('map', () => {
    it('following function will not be invoked', () => {
      const none: None<number> = None.of<number>();

      const spy: SinonSpy = sinon.spy();

      const quantum: Quantum<number> = none.map<number>((value: number) => {
        spy();
        return value;
      });

      expect(spy.called).toEqual(false);
      expect(quantum).toBeInstanceOf(None);
    });
  });

  describe('toTry', () => {
    it('returns Failure', () => {
      const none: None<number> = None.of<number>();

      const trial: Try<number, QuantumError> = none.toTry();

      expect(trial.isFailure()).toEqual(true);
    });
  });

  describe('filter', () => {
    it('following function will not be invoked', () => {
      const none: None<number> = None.of<number>();

      const spy: SinonSpy = sinon.spy();

      const quantum: Quantum<number> = none.filter((value: number) => {
        spy();
        return true;
      });

      expect(spy.called).toEqual(false);
      expect(none).toBe(quantum);
    });
  });
});
