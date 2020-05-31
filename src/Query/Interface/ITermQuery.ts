import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';

import { TermsError } from '../../VO/Term/Error/TermsError';
import { Terms } from '../../VO/Term/Terms';
import { IQuery } from './IQuery';

export interface ITermQuery extends IQuery {
  readonly noun: 'TermQuery';

  all(): Promise<Superposition<Terms, TermsError | DataSourceError>>;
}
