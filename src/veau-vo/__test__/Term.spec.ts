import 'jest';
import {Term} from '../Term';

describe('Term', () => {
  it('equals', () => {
    const term1: Term = Term.DAILY;
    const term2: Term = Term.WEEKLY;
    const term3: Term = Term.DAILY;

    expect(term1.equals(term1)).toEqual(true);
    expect(term1.equals(term2)).toEqual(false);
    expect(term1.equals(term3)).toEqual(true);
  });

  it('of', () => {
    expect(Term.of(1)).toEqual(Term.DAILY);
    expect(Term.of(2)).toEqual(Term.WEEKLY);
    expect(Term.of(3)).toEqual(Term.MONTHLY);
    expect(Term.of(4)).toEqual(Term.ANNUAL);
  });
});
