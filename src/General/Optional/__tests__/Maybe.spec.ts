import { maybe } from '../Maybe';
import { None } from '../None';
import { Some } from '../Some';

describe('Maybe', () => {
  describe('maybe', () => {
    it('when null and undefined given, generates None instance', () => {
      expect(maybe(1)).toBeInstanceOf(Some);
      expect(maybe(0)).toBeInstanceOf(Some);
      expect(maybe('a')).toBeInstanceOf(Some);
      expect(maybe('')).toBeInstanceOf(Some);
      expect(maybe(true)).toBeInstanceOf(Some);
      expect(maybe(false)).toBeInstanceOf(Some);
      expect(maybe(null)).toBeInstanceOf(None);
      expect(maybe(undefined)).toBeInstanceOf(None);
    });

    it('when instances of Some given, returns themselves', () => {
      const some1: Some<number> = Some.of<number>(1);
      const some2: Some<number> = Some.of<number>(0);
      const some3: Some<number> = Some.of<number>(-1);
      const some4: Some<string> = Some.of<string>('');
      const some5: Some<string> = Some.of<string>('1');
      const some6: Some<boolean> = Some.of<boolean>(true);
      const some7: Some<boolean> = Some.of<boolean>(false);

      expect(maybe(some1)).toBe(some1);
      expect(maybe(some2)).toBe(some2);
      expect(maybe(some3)).toBe(some3);
      expect(maybe(some4)).toBe(some4);
      expect(maybe(some5)).toBe(some5);
      expect(maybe(some6)).toBe(some6);
      expect(maybe(some7)).toBe(some7);
    });

    it('when instances of None given, returns themselves', () => {
      const none: None<number> = None.of<number>();

      expect(maybe(none)).toBe(none);
    });
  });
});
