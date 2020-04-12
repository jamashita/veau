import sinon, { SinonSpy } from 'sinon';
import { Try } from '../../Try/Try';
import { None } from '../None';
import { Optional } from '../Optional';
import { OptionalError } from '../OptionalError';

describe('None', () => {
  describe('get', () => {
    it('throws OptionalError', () => {
      const none1: None<void> = None.of();
      const none2: None<number> = None.of<number>();

      expect(() => {
        none1.get();
      }).toThrow(OptionalError);
      expect(() => {
        none2.get();
      }).toThrow(OptionalError);
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

  describe('isEmpty', () => {
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
      const none: Optional<number> = None.of<number>();

      const spy: SinonSpy = sinon.spy();

      const optional: Optional<number> = none.map<number>((value: number) => {
        spy();
        return value;
      });

      expect(spy.called).toEqual(false);
      expect(optional).toBeInstanceOf(None);
    });
  });

  describe('toTry', () => {
    it('returns Failure', () => {
      const none: None<number> = None.of<number>();

      const trial: Try<number, OptionalError> = none.toTry();

      expect(trial.isFailure()).toEqual(true);
    });
  });

  describe('filter', () => {
    it('following function will not be invoked', () => {
      const none: Optional<number> = None.of<number>();

      const spy: SinonSpy = sinon.spy();

      const optional: Optional<number> = none.filter((value: number) => {
        spy();
        return true;
      });

      expect(spy.called).toEqual(false);
      expect(none).toBe(optional);
      expect(optional).toBeInstanceOf(None);
    });
  });
});
