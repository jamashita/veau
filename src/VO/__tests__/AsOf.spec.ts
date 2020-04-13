import sinon, { SinonSpy } from 'sinon';
import { AsOfError } from '../../Error/AsOfError';
import { Try } from '../../General/Try/Try';
import { AsOf } from '../AsOf';
import { Term } from '../Term';
import { Terms } from '../Terms';
import { MockTerm } from '../Mock/MockTerm';

// TODO
describe('AsOf', () => {
  describe('ofString', () => {
    it('normal case', () => {
      const trial1: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');
      const trial2: Try<AsOf, AsOfError> = AsOf.ofString('2000-01-01');

      expect(trial1.isSuccess()).toEqual(true);
      expect(trial2.isSuccess()).toEqual(true);
    });

    it('will return Failure because the string format is not compatible to date time', () => {
      const trial1: Try<AsOf, AsOfError> = AsOf.ofString('deux mille');
      const trial2: Try<AsOf, AsOfError> = AsOf.ofString('dos mil');

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();
      const spy3: SinonSpy = sinon.spy();
      const spy4: SinonSpy = sinon.spy();

      expect(trial1.isFailure()).toEqual(true);
      expect(trial2.isFailure()).toEqual(true);
      trial1.match<void>(() => {
        spy1();
      }, (err: AsOfError) => {
        spy2();
        expect(err).toBeInstanceOf(AsOfError);
      });

      trial2.match<void>(() => {
        spy3();
      }, (err: AsOfError) => {
        spy4();
        expect(err).toBeInstanceOf(AsOfError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
      expect(spy3.called).toEqual(false);
      expect(spy4.called).toEqual(true);
    });
  });

  describe('equals', () => {
    it('returns true if both properties are the same', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-01').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-01').get();

      expect(asOf1.equals(asOf1)).toEqual(true);
      expect(asOf1.equals(asOf2)).toEqual(false);
      expect(asOf1.equals(asOf3)).toEqual(true);
    });
  });

  describe('isBefore', () => {
    it('returns true if the value is before than the other', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-03').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-04').get();

      expect(asOf2.isBefore(asOf1)).toEqual(false);
      expect(asOf2.isBefore(asOf2)).toEqual(false);
      expect(asOf2.isBefore(asOf3)).toEqual(true);
    });
  });

  describe('isAfter', () => {
    it('returns true if the value is after than the other', () => {
      const asOf1: AsOf = AsOf.ofString('2000-01-02').get();
      const asOf2: AsOf = AsOf.ofString('2000-01-03').get();
      const asOf3: AsOf = AsOf.ofString('2000-01-04').get();

      expect(asOf2.isAfter(asOf1)).toEqual(true);
      expect(asOf2.isAfter(asOf2)).toEqual(false);
      expect(asOf2.isAfter(asOf3)).toEqual(false);
    });
  });

  describe('previous', () => {
    it('Term.DAILY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.DAILY);

      expect(asOf.toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('1999-12-31');
    });

    it('Term.WEEKLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.WEEKLY);

      expect(asOf.toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('1999-12-25');
    });

    it('Term.MONTHLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.MONTHLY);

      expect(asOf.toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('1999-12-01');
    });

    it('Term.QUARTERLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.QUARTERLY);

      expect(asOf.toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('1999-10-01');
    });

    it('Term.ANNUAL', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.previous(Term.ANNUAL);

      expect(asOf.toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('1999-01-01');
    });

    it('all', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const allTerm: Terms = Terms.all();

      for (let i: number = 0; i < allTerm.size(); i++) {
        expect(() => {
          asOf.previous(allTerm.get(i).get());
        }).not.toThrow(AsOfError);
      }
    });

    it('throws AsOfError because this situation is not considered', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const fakeTerm: MockTerm = new MockTerm();

      expect(() => {
        asOf.previous(fakeTerm);
      }).toThrow(AsOfError);
    });
  });

  describe('next', () => {
    it('Term.DAILY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.DAILY);

      expect(asOf.toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('2000-01-02');
    });

    it('Term.WEEKLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.WEEKLY);

      expect(asOf.toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('2000-01-08');
    });

    it('Term.MONTHLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.MONTHLY);

      expect(asOf.toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('2000-02-01');
    });

    it('Term.QUARTERLY', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.QUARTERLY);

      expect(asOf.toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('2000-04-01');
    });

    it('Term.ANNUAL', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const newAsOf: AsOf = asOf.next(Term.ANNUAL);

      expect(asOf.toString()).toEqual('2000-01-01');
      expect(newAsOf.toString()).toEqual('2001-01-01');
    });

    it('all', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const allTerm: Terms = Terms.all();

      for (let i: number = 0; i < allTerm.size(); i++) {
        expect(() => {
          asOf.next(allTerm.get(i).get());
        }).not.toThrow(AsOfError);
      }
    });

    it('throws AsOfError because this situation is not considered', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();
      const fakeTerm: MockTerm = new MockTerm();

      expect(() => {
        asOf.next(fakeTerm);
      }).toThrow(AsOfError);
    });
  });

  describe('toString', () => {
    it('normal case', () => {
      const asOf: AsOf = AsOf.ofString('2000-01-01').get();

      expect(asOf.toString()).toEqual('2000-01-01');
    });
  });
});
