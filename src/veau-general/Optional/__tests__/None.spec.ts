import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { MockNominative } from '../MockNominative';
import { None } from '../None';
import { Optional } from '../Optional';
import { OptionalError } from '../OptionalError';

describe('None', () => {
  describe('get', () => {
    it('throws Error', () => {
      const none: None<MockNominative> = None.of<MockNominative>();

      expect(() => {
        none.get();
      }).toThrow(OptionalError);
    });
  });

  describe('isPresent', () => {
    it('returns false', () => {
      const none: None<MockNominative> = None.of<MockNominative>();

      expect(none.isPresent()).toEqual(false);
    });
  });

  describe('ifPresent', () => {
    it('following function will not be invoked', () => {
      const none: None<MockNominative> = None.of<MockNominative>();
      const spy: SinonSpy = sinon.spy();

      none.ifPresent(() => {
        spy();
      });

      expect(spy.called).toEqual(false);
    });
  });

  describe('map', () => {
    it('following function will not be invoked', () => {
      const none: None<MockNominative> = None.of<MockNominative>();
      const spy: SinonSpy = sinon.spy();

      const optional: Optional<MockNominative> = none.map<MockNominative>((value: MockNominative) => {
        spy();
        return value;
      });

      expect(spy.called).toEqual(false);
      expect(optional instanceof None).toEqual(true);
    });
  });

  describe('filter', () => {
    it('following function will not be invoked', () => {
      const none: None<MockNominative> = None.of<MockNominative>();
      const spy: SinonSpy = sinon.spy();

      const optional: Optional<MockNominative> = none.filter((value: MockNominative) => {
        spy();
        return true;
      });

      expect(spy.called).toEqual(false);
      expect(optional instanceof None).toEqual(true);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const none: None<MockNominative> = None.of<MockNominative>();

      expect(none.toString()).toEqual('Optional<NONE>');
    });
  });
});
