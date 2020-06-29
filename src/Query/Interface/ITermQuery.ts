import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { TermsError } from '../../VO/Term/Error/TermsError';
import { Terms } from '../../VO/Term/Terms';
import { IQuery } from './IQuery';

export interface ITermQuery<E extends DataSourceError = DataSourceError> extends IQuery<'TermQuery'> {
  readonly noun: 'TermQuery';

  all(): Superposition<Terms, TermsError | E>;
}
