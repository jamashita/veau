import 'jest';
import { RuntimeError } from '../../veau-general/RuntimeError';
import { Term } from '../Term';

describe('Term', () => {
  describe('of', () => {
    it('normal case', () => {
      expect(Term.of(1)).toEqual(Term.DAILY);
      expect(Term.of(2)).toEqual(Term.WEEKLY);
      expect(Term.of(3)).toEqual(Term.MONTHLY);
      expect(Term.of(4)).toEqual(Term.QUARTERLY);
      expect(Term.of(5)).toEqual(Term.ANNUAL);
    });

    it('throws RuntimeError', () => {
      expect(() => {
        Term.of(-1);
      }).toThrow(RuntimeError);
      expect(() => {
        Term.of(0);
      }).toThrow(RuntimeError);
      expect(() => {
        Term.of(6);
      }).toThrow(RuntimeError);
    });
  });
});
