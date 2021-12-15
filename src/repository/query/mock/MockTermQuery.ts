import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { TermError } from '../../../domain/vo/Term/error/TermError.js';
import { Terms } from '../../../domain/vo/Term/Terms.js';
import { ITermQuery } from '../ITermQuery.js';
import { IMockQuery } from './IMockQuery.js';

export class MockTermQuery implements ITermQuery, IMockQuery {
  public readonly noun: 'TermQuery' = 'TermQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Terms, DataSourceError | TermError> {
    throw new UnimplementedError();
  }
}
