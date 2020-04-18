import { Absent } from '../Absent';
import { maybe } from '../Maybe';
import { Present } from '../Present';

describe('Maybe', () => {
  describe('maybe', () => {
    it('when null and undefined given, generates Absent instance', () => {
      expect(maybe(1)).toBeInstanceOf(Present);
      expect(maybe(0)).toBeInstanceOf(Present);
      expect(maybe('a')).toBeInstanceOf(Present);
      expect(maybe('')).toBeInstanceOf(Present);
      expect(maybe(true)).toBeInstanceOf(Present);
      expect(maybe(false)).toBeInstanceOf(Present);
      expect(maybe(null)).toBeInstanceOf(Absent);
      expect(maybe(undefined)).toBeInstanceOf(Absent);
    });

    it('when instances of Present given, returns themselves', () => {
      const present1: Present<number> = Present.of<number>(1);
      const present2: Present<number> = Present.of<number>(0);
      const present3: Present<number> = Present.of<number>(-1);
      const present4: Present<string> = Present.of<string>('');
      const present5: Present<string> = Present.of<string>('1');
      const present6: Present<boolean> = Present.of<boolean>(true);
      const present7: Present<boolean> = Present.of<boolean>(false);

      expect(maybe(present1)).toBe(present1);
      expect(maybe(present2)).toBe(present2);
      expect(maybe(present3)).toBe(present3);
      expect(maybe(present4)).toBe(present4);
      expect(maybe(present5)).toBe(present5);
      expect(maybe(present6)).toBe(present6);
      expect(maybe(present7)).toBe(present7);
    });

    it('when instances of Absent given, returns themselves', () => {
      const absent: Absent<number> = Absent.of<number>();

      expect(maybe(absent)).toBe(absent);
    });
  });
});
