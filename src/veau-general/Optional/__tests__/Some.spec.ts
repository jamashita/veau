import 'jest';
import sinon, { SinonSpy } from 'sinon';
import { Try } from '../../Try/Try';
import { MockNominative } from '../MockNominative';
import { None } from '../None';
import { Optional } from '../Optional';
import { OptionalError } from '../OptionalError';
import { Some } from '../Some';

describe('Some', () => {
  describe('get', () => {
    it('the value is got by get method', () => {
      const some1: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const some2: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(0));
      const some3: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(-1));
      const some4: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(''));
      const some5: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of('1'));
      const some6: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(true));
      const some7: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(false));

      expect(some1.get().get()).toEqual(1);
      expect(some2.get().get()).toEqual(0);
      expect(some3.get().get()).toEqual(-1);
      expect(some4.get().get()).toEqual('');
      expect(some5.get().get()).toEqual('1');
      expect(some6.get().get()).toEqual(true);
      expect(some7.get().get()).toEqual(false);
    });
  });

  describe('isPresent', () => {
    it('returns true', () => {
      const some1: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const some2: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(0));
      const some3: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(-1));
      const some4: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(''));
      const some5: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of('1'));
      const some6: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(true));
      const some7: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(false));

      expect(some1.isPresent()).toEqual(true);
      expect(some2.isPresent()).toEqual(true);
      expect(some3.isPresent()).toEqual(true);
      expect(some4.isPresent()).toEqual(true);
      expect(some5.isPresent()).toEqual(true);
      expect(some6.isPresent()).toEqual(true);
      expect(some7.isPresent()).toEqual(true);
    });
  });

  describe('isEmpty', () => {
    it('returns false', () => {
      const some1: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const some2: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(0));
      const some3: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(-1));
      const some4: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(''));
      const some5: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of('1'));
      const some6: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(true));
      const some7: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(false));

      expect(some1.isEmpty()).toEqual(false);
      expect(some2.isEmpty()).toEqual(false);
      expect(some3.isEmpty()).toEqual(false);
      expect(some4.isEmpty()).toEqual(false);
      expect(some5.isEmpty()).toEqual(false);
      expect(some6.isEmpty()).toEqual(false);
      expect(some7.isEmpty()).toEqual(false);
    });
  });

  describe('ifPresent', () => {
    it('consumer will be invoked', () => {
      const some: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const spy1: SinonSpy = sinon.spy();

      some.ifPresent((value: MockNominative) => {
        spy1(value);
      });

      expect(spy1.calledWith(some.get())).toEqual(true);
    });
  });

  describe('ifPresentAsync', () => {
    it('consumer will be invoked', async () => {
      const some: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const spy1: SinonSpy = sinon.spy();

      await some.ifPresentAsync(async (value: MockNominative) => {
        spy1(value);
      });

      expect(spy1.calledWith(some.get())).toEqual(true);
    });
  });

  describe('map', () => {
    it('following function is called', () => {
      const some: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const spy: SinonSpy = sinon.spy();

      const optional: Optional<MockNominative> = some.map<MockNominative>((value: MockNominative) => {
        spy();
        return MockNominative.of(value.get() as number * 2);
      });

      expect(spy.called).toEqual(true);
      expect(optional.isPresent()).toEqual(true);
      expect(optional.get().get()).toEqual(2);
    });
  });

  describe('toTry', () => {
    it('returns Success', () => {
      const some: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));

      const trial: Try<MockNominative, OptionalError> = some.toTry();

      expect(trial.isSuccess()).toEqual(true);
    });
  });


  describe('equals', () => {
    it('values are the same, returns true', () => {
      const some1: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const some2: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const some3: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of('a'));
      const some4: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of('a'));
      const some5: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(true));
      const some6: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(true));

      expect(some1.equals(some1)).toEqual(true);
      expect(some1.equals(some2)).toEqual(true);
      expect(some3.equals(some3)).toEqual(true);
      expect(some3.equals(some4)).toEqual(true);
      expect(some5.equals(some5)).toEqual(true);
      expect(some5.equals(some6)).toEqual(true);
    });

    it('if the value is not the same, returns false', () => {
      const some1: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const some2: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(2));
      const some3: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of('a'));
      const some4: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of('b'));
      const some5: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(true));
      const some6: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(false));

      expect(some1.equals(some2)).toEqual(false);
      expect(some3.equals(some4)).toEqual(false);
      expect(some5.equals(some6)).toEqual(false);
    });

    it('none and some are always not equal, reutns false', () => {
      const some1: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const some2: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of('a'));
      const some3: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(true));
      const none: None<MockNominative> = None.of<MockNominative>();

      expect(some1.equals(none)).toEqual(false);
      expect(some2.equals(none)).toEqual(false);
      expect(some3.equals(none)).toEqual(false);
    });
  });

  describe('filter', () => {
    it('following function is called', () => {
      const some1: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const some2: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(2));

      const optional1: Optional<MockNominative> = some1.filter((value: MockNominative) => {
        if (value.get() as number % 2 === 0) {
          return true;
        }

        return false;
      });
      const optional2: Optional<MockNominative> = some2.filter((value: MockNominative) => {
        if (value.get() as number % 2 === 0) {
          return true;
        }

        return false;
      });

      expect(optional1).toBeInstanceOf(None);
      expect(optional2).toBeInstanceOf(Some);
      expect(optional1.isPresent()).toEqual(false);
      expect(optional2.isPresent()).toEqual(true);
      expect(optional2.get().get()).toEqual(2);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const some1: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const some2: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(0));
      const some3: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(-1));
      const some4: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(''));
      const some5: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of('1'));
      const some6: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(true));
      const some7: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(false));

      expect(some1.toString()).toEqual('Optional<1>');
      expect(some2.toString()).toEqual('Optional<0>');
      expect(some3.toString()).toEqual('Optional<-1>');
      expect(some4.toString()).toEqual('Optional<>');
      expect(some5.toString()).toEqual('Optional<1>');
      expect(some6.toString()).toEqual('Optional<true>');
      expect(some7.toString()).toEqual('Optional<false>');
    });
  });
});
