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

    it('when instances of Some given, returns themselves', () => {
      const some1: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(1));
      const some2: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(0));
      const some3: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(-1));
      const some4: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(''));
      const some5: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of('1'));
      const some6: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(true));
      const some7: Some<MockNominative> = Some.of<MockNominative>(MockNominative.of(false));

      expect(maybe(some1)).toBe(some1);
      expect(maybe(some2)).toBe(some2);
      expect(maybe(some3)).toBe(some3);
      expect(maybe(some4)).toBe(some4);
      expect(maybe(some5)).toBe(some5);
      expect(maybe(some6)).toBe(some6);
      expect(maybe(some7)).toBe(some7);
    });

    it('when instances of None given, returns themselves', () => {
      const none: None<MockNominative> = None.of<MockNominative>();

      expect(maybe(none)).toBe(none);
    });
  });
});
