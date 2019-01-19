import {Term} from '../veau-vo/Term';

export class TermRepository implements ITermRepository {
  private static instance: TermRepository = new TermRepository();

  public static getInstance(): TermRepository {
    return TermRepository.instance;
  }

  private constructor() {
  }

  public all(): Array<Term> {
    return [
      Term.DAILY,
      Term.WEEKLY,
      Term.MONTHLY,
      Term.ANNUAL
    ];
  }

  public findByTermID(termID: number): Term {
    return Term.of(termID);
  }
}

export interface ITermRepository {

  all(): Array<Term>;

  findByTermID(termID: number): Term;
}
