import { DataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { TermError } from '../../VO/Term/Error/TermError';
import { Terms } from '../../VO/Term/Terms';
import { IQuery } from './IQuery';

export interface ITermQuery<E extends DataSourceError = DataSourceError> extends IQuery<'TermQuery'> {
  readonly noun: 'TermQuery';

  all(): Superposition<Terms, TermError | E>;
}
