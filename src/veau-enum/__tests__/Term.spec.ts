/* tslint:disable */
import 'jest';
import { RuntimeError } from '../../veau-error/RuntimeError';
import { Term } from '../Term';

describe('Term', () => {
  it('of', () => {
    expect(Term.of(1)).toEqual(Term.DAILY);
    expect(Term.of(2)).toEqual(Term.WEEKLY);
    expect(Term.of(3)).toEqual(Term.MONTHLY);
    expect(Term.of(4)).toEqual(Term.QUARTERLY);
    expect(Term.of(5)).toEqual(Term.ANNUAL);
  });

  it('of: throws Error', () => {
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
