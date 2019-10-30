import 'jest';
import { OptionalError } from '../OptionalError';
import { present } from '../Present';
import { Some } from '../Some';

describe('Present', () => {
  describe('present', () => {
    it('throws Error when null and undefined are given', () => {
      expect(() => {
        present<number>(null);
      }).toThrow(OptionalError);
      expect(() => {
        present<number>(undefined);
      }).toThrow(OptionalError);
      expect(present<number>(-1) instanceof Some).toEqual(true);
      expect(present<number>(0) instanceof Some).toEqual(true);
      expect(present<number>(1) instanceof Some).toEqual(true);
      expect(present<string>('') instanceof Some).toEqual(true);
      expect(present<string>('0') instanceof Some).toEqual(true);
    });
  });
});
