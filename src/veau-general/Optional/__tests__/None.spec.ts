import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { MockNominative } from '../MockNominative';
import { None } from '../None';
import { Optional } from '../Optional';
import { OptionalError } from '../OptionalError';
import { Some } from '../Some';

describe('None', () => {
  describe('get', () => {
    it('throws OptionalError', () => {
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

  describe('isEmpty', () => {
    it('returns true', () => {
      const none: None<MockNominative> = None.of<MockNominative>();

      expect(none.isEmpty()).toEqual(true);
    });
  });

  describe('ifPresentOrElse', () => {
    it('empty section will be invoked', () => {
      const none: None<MockNominative> = None.of<MockNominative>();
      const v1: string = 'muchas frases';
      const v2: string = 'muchas palabras';
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const ret: string = none.ifPresentOrElse<string>(() => {
        spy1();
        return v1;
      }, () => {
        spy2();
        return v2;
      });

      expect(ret).toEqual(v2);
      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
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
      expect(optional).toBeInstanceOf(None);
    });
  });

  describe('equals', () => {
    it('None are always the same, returns true', () => {
      const none1: None<MockNominative> = None.of<MockNominative>();
      const none2: None<MockNominative> = None.of<MockNominative>();

      expect(none1.equals(none1)).toEqual(true);
      expect(none1.equals(none2)).toEqual(true);
    });

    it('none and some are always not equal, returns false', () => {
      const none: None<MockNominative> = None.of<MockNominative>();
      const some: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));

      expect(none.equals(some)).toEqual(false);
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
      expect(optional).toBeInstanceOf(None);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const none: None<MockNominative> = None.of<MockNominative>();

      expect(none.toString()).toEqual('Optional<NONE>');
    });
  });
});
