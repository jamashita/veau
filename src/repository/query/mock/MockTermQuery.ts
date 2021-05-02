import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { TermError } from '../../../domain/vo/Term/error/TermError';
import { Terms } from '../../../domain/vo/Term/Terms';
import { ITermQuery } from '../interface/ITermQuery';
import { IMockQuery } from './interface/IMockQuery';

export class MockTermQuery implements ITermQuery, IMockQuery {
  public readonly noun: 'TermQuery' = 'TermQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Terms, DataSourceError | TermError> {
    throw new UnimplementedError();
  }
}
