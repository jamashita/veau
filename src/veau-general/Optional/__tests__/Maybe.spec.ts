import 'jest';
import { maybe } from '../Maybe';
import { MockNominative } from '../MockNominative';
import { None } from '../None';
import { Some } from '../Some';

describe('Maybe', () => {
  describe('maybe', () => {
    it('when null and undefined given, generates None instance', () => {
      expect(maybe(MockNominative.of(1))).toBeInstanceOf(Some);
      expect(maybe(MockNominative.of(0))).toBeInstanceOf(Some);
      expect(maybe(MockNominative.of('a'))).toBeInstanceOf(Some);
      expect(maybe(MockNominative.of(''))).toBeInstanceOf(Some);
      expect(maybe(MockNominative.of(true))).toBeInstanceOf(Some);
      expect(maybe(MockNominative.of(false))).toBeInstanceOf(Some);
      expect(maybe(null)).toBeInstanceOf(None);
      expect(maybe(undefined)).toBeInstanceOf(None);
    });
  });
});
