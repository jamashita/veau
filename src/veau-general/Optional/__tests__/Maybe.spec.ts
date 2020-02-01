import 'jest';
import { maybe } from '../Maybe';
import { MockNominative } from '../MockNominative';
import { None } from '../None';
import { Some } from '../Some';

describe('Maybe', () => {
  describe('maybe', () => {
    it('when null and undefined given, generates None instance', () => {
      expect(maybe(MockNominative.of(1)) instanceof Some).toEqual(true);
      expect(maybe(MockNominative.of(0)) instanceof Some).toEqual(true);
      expect(maybe(MockNominative.of('a')) instanceof Some).toEqual(true);
      expect(maybe(MockNominative.of('')) instanceof Some).toEqual(true);
      expect(maybe(MockNominative.of(true)) instanceof Some).toEqual(true);
      expect(maybe(MockNominative.of(false)) instanceof Some).toEqual(true);
      expect(maybe(null) instanceof None).toEqual(true);
      expect(maybe(undefined) instanceof None).toEqual(true);
    });
  });
});
