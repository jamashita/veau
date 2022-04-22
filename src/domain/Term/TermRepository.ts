import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { TermError } from '../../domain/Term/TermError.js';
import { Terms } from '../../domain/Term/Terms.js';

export interface TermRepository<E extends DataSourceError = DataSourceError> {
  all(): Promise<Schrodinger<Terms, E | TermError>>;
}
