import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { TermError } from '../../../domain/vo/Term/error/TermError.js';
import { Terms } from '../../../domain/vo/Term/Terms.js';
import { IQuery } from './IQuery.js';

export interface ITermQuery<E extends DataSourceError = DataSourceError> extends IQuery<'TermQuery'> {
  readonly noun: 'TermQuery';

  all(): Superposition<Terms, E | TermError>;
}
