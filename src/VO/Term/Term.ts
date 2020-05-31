import { Alive, Dead, Superposition } from '@jamashita/publikum-monad';
import { ValueObject } from '@jamashita/publikum-object';
import { Ambiguous } from '@jamashita/publikum-type';
import { UUID } from '@jamashita/publikum-uuid';

import { TermError } from './Error/TermError';
import { TermID } from './TermID';
import { TermKey } from './TermKey';

const DAILY_ID: string = '34b53215-a990-44d7-926e-30d6a53611d9';
const WEEKLY_ID: string = 'e194c8ed-f53b-4ac5-b506-a06900e7053c';
const MONTHLY_ID: string = '5a60eb2e-64f4-4d18-b8c1-34d3fa6a6262';
const QUARTERLY_ID: string = 'fbfe34f4-9757-4133-8353-c9a4bf3479d3';
const ANNUAL_ID: string = '96f0d8a0-a136-4fb1-bc07-22dad6b8a21c';

export class Term extends ValueObject {
  public readonly noun: 'Term' = 'Term';
  private readonly termID: TermID;
  private readonly key: TermKey;

  public static readonly DAILY: Term = new Term(TermID.of(UUID.of(DAILY_ID)), TermKey.of('DAILY'));
  public static readonly WEEKLY: Term = new Term(TermID.of(UUID.of(WEEKLY_ID)), TermKey.of('WEEKLY'));
  public static readonly MONTHLY: Term = new Term(TermID.of(UUID.of(MONTHLY_ID)), TermKey.of('MONTHLY'));
  public static readonly QUARTERLY: Term = new Term(TermID.of(UUID.of(QUARTERLY_ID)), TermKey.of('QUARTERLY'));
  public static readonly ANNUAL: Term = new Term(TermID.of(UUID.of(ANNUAL_ID)), TermKey.of('ANNUAL'));
  private static readonly all: Map<string, Term> = Term.init();

  private static init(): Map<string, Term> {
    const map: Map<string, Term> = new Map<string, Term>();

    map.set(DAILY_ID, Term.DAILY);
    map.set(WEEKLY_ID, Term.WEEKLY);
    map.set(MONTHLY_ID, Term.MONTHLY);
    map.set(QUARTERLY_ID, Term.QUARTERLY);
    map.set(ANNUAL_ID, Term.ANNUAL);

    return map;
  }

  public static of(uuid: UUID): Superposition<Term, TermError> {
    return Term.ofString(uuid.get());
  }

  public static ofTermID(termID: TermID): Superposition<Term, TermError> {
    return Term.of(termID.get());
  }

  public static ofString(id: string): Superposition<Term, TermError> {
    const term: Ambiguous<Term> = Term.all.get(id);

    if (term === undefined) {
      return Dead.of<Term, TermError>(new TermError(`${id}`));
    }

    return Alive.of<Term, TermError>(term);
  }

  protected constructor(termID: TermID, key: TermKey) {
    super();
    this.termID = termID;
    this.key = key;
  }

  public getTermID(): TermID {
    return this.termID;
  }

  public getKey(): TermKey {
    return this.key;
  }

  public equals(other: Term): boolean {
    if (this === other) {
      return true;
    }
    if (!this.termID.equals(other.termID)) {
      return false;
    }
    if (!this.key.equals(other.key)) {
      return false;
    }

    return true;
  }

  public serialize(): string {
    const properties: Array<string> = [];

    properties.push(this.termID.toString());
    properties.push(this.key.toString());

    return properties.join(' ');
  }
}
