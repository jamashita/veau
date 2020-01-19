import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { None } from '../None';
import { Optional } from '../Optional';
import { OptionalError } from '../OptionalError';

describe('None', () => {
  describe('get', () => {
    it('throws Error', () => {
      const none: None<number> = None.of<number>();

      expect(() => {
        none.get();
      }).toThrow(OptionalError);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const none: None<object> = None.of<object>();

      expect(none.isPresent()).toEqual(false);
    });
  });

  describe('ifPresent', () => {
    it('following function will not be invoked', () => {
      const none: None<boolean> = None.of<boolean>();
      const spy: SinonSpy = sinon.spy();

      none.ifPresent(() => {
        spy();
      });

      expect(spy.called).toEqual(false);
    });
  });

  describe('map', () => {
    it('following function will not be invoked', () => {
      const none: None<string> = None.of<string>();
      const spy: SinonSpy = sinon.spy();

      const optional: Optional<number> = none.map<number>((value: string) => {
        spy();
        return Number(value);
      });

      expect(spy.called).toEqual(false);
      expect(optional instanceof None).toEqual(true);
    });
  });

  describe('filter', () => {
    it('following function will not be invoked', () => {
      const none: None<string> = None.of<string>();
      const spy: SinonSpy = sinon.spy();

      const optional: Optional<string> = none.filter((value: string) => {
        spy();
        return true;
      });

      expect(spy.called).toEqual(false);
      expect(optional instanceof None).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const none: None<string> = None.of<string>();

      expect(none.toString()).toEqual('Optional<NONE>');
    });
  });
});
