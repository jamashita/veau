import { Alive, Dead, Superposition, UUID, ValueObject } from 'publikum';
import { TermError } from '../Error/TermError';
import { TermID } from './TermID';
import { TermKey } from './TermKey';

const DAILY_UUID: string = '34b53215-a990-44d7-926e-30d6a53611d9';
const WEEKLY_UUID: string = 'e194c8ed-f53b-4ac5-b506-a06900e7053c';
const MONTHLY_UUID: string = '5a60eb2e-64f4-4d18-b8c1-34d3fa6a6262';
const QUARTERLY_UUID: string = 'fbfe34f4-9757-4133-8353-c9a4bf3479d3';
const ANNUAL_UUID: string = '96f0d8a0-a136-4fb1-bc07-22dad6b8a21c';

export class Term extends ValueObject {
  public readonly noun: 'Term' = 'Term';
  private readonly termID: TermID;
  private readonly key: TermKey;

  public static readonly DAILY: Term = new Term(TermID.ofString(DAILY_UUID).get(), TermKey.of('DAILY'));
  public static readonly WEEKLY: Term = new Term(TermID.ofString(WEEKLY_UUID).get(), TermKey.of('WEEKLY'));
  public static readonly MONTHLY: Term = new Term(TermID.ofString(MONTHLY_UUID).get(), TermKey.of('MONTHLY'));
  public static readonly QUARTERLY: Term = new Term(TermID.ofString(QUARTERLY_UUID).get(), TermKey.of('QUARTERLY'));
  public static readonly ANNUAL: Term = new Term(TermID.ofString(ANNUAL_UUID).get(), TermKey.of('ANNUAL'));

  public static of(uuid: UUID): Superposition<Term, TermError> {
    return Term.ofString(uuid.get());
  }

  public static ofString(id: string): Superposition<Term, TermError> {
    switch (id) {
      case DAILY_UUID: {
        return Alive.of<Term, TermError>(Term.DAILY);
      }
      case WEEKLY_UUID: {
        return Alive.of<Term, TermError>(Term.WEEKLY);
      }
      case MONTHLY_UUID: {
        return Alive.of<Term, TermError>(Term.MONTHLY);
      }
      case QUARTERLY_UUID: {
        return Alive.of<Term, TermError>(Term.QUARTERLY);
      }
      case ANNUAL_UUID: {
        return Alive.of<Term, TermError>(Term.ANNUAL);
      }
      default: {
        return Dead.of<Term, TermError>(new TermError(`${id}`));
      }
    }
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
