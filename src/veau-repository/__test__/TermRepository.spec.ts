/* tslint:disable */
import 'jest';
import { NoSuchElementError } from '../../veau-general/NoSuchElementError';
import { Term } from '../../veau-vo/Term';
import { TermRepository } from '../TermRepository';

describe('TermRepository', () => {
  it('all', () => {
    const termRepository: TermRepository = TermRepository.getInstance();
    const terms: Array<Term> = termRepository.all();

    expect(terms).toEqual([
      Term.DAILY,
      Term.WEEKLY,
      Term.MONTHLY,
      Term.QUARTERLY,
      Term.ANNUAL
    ]);
  });

  it('findByTermID', () => {
    const termRepository: TermRepository = TermRepository.getInstance();

    expect(termRepository.findByTermID(1)).toEqual(Term.DAILY);
    expect(termRepository.findByTermID(2)).toEqual(Term.WEEKLY);
    expect(termRepository.findByTermID(3)).toEqual(Term.MONTHLY);
    expect(termRepository.findByTermID(4)).toEqual(Term.QUARTERLY);
    expect(termRepository.findByTermID(5)).toEqual(Term.ANNUAL);
  });

  it('findByTermID: throw Error', () => {
    const termRepository: TermRepository = TermRepository.getInstance();

    expect(() => {
      termRepository.findByTermID(-1);
    }).toThrow(NoSuchElementError);
    expect(() => {
      termRepository.findByTermID(0);
    }).toThrow(NoSuchElementError);
    expect(() => {
      termRepository.findByTermID(6);
    }).toThrow(NoSuchElementError);
  });
});
