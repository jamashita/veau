import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { TermError } from '../../VO/Term/Error/TermError';
import { Terms } from '../../VO/Term/Terms';
import { ITermQuery } from '../Interface/ITermQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockTermQuery implements ITermQuery, IMockQuery {
  public readonly noun: 'TermQuery' = 'TermQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Terms, TermError | DataSourceError> {
    throw new UnimplementedError();
  }
}
