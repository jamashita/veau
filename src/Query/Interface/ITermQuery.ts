import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { TermError } from '../../VO/Term/Error/TermError';
import { Terms } from '../../VO/Term/Terms';
import { IQuery } from './IQuery';

export interface ITermQuery<E extends DataSourceError = DataSourceError> extends IQuery<'TermQuery'> {
  readonly noun: 'TermQuery';

  all(): Superposition<Terms, E | TermError>;
}
