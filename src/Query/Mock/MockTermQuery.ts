import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { TermsError } from '../../VO/Term/Error/TermsError';
import { Terms } from '../../VO/Term/Terms';
import { ITermQuery } from '../Interface/ITermQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockTermQuery implements ITermQuery, IMockQuery {
  public readonly noun: 'TermQuery' = 'TermQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Terms, TermsError | DataSourceError> {
    throw new UnimplementedError();
  }
}
