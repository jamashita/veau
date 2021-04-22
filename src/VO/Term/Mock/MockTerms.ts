import { ImmutableProject } from '@jamashita/lluvia-collection';
import { Term } from '../Term';
import { TermID } from '../TermID';
import { Terms } from '../Terms';

export class MockTerms extends Terms {
  private static toProject(terms: Array<Term>): ImmutableProject<TermID, Term> {
    const map: Map<TermID, Term> = new Map<TermID, Term>();

    terms.forEach((term: Term) => {
      map.set(term.getTermID(), term);
    });

    return ImmutableProject.ofMap<TermID, Term>(map);
  }

  public constructor(...terms: ReadonlyArray<Term>) {
    super(MockTerms.toProject([...terms]));
  }
}
