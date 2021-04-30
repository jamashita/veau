import { UnimplementedError } from '@jamashita/anden-error';
import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { TermError } from '../../VO/Term/Error/TermError';
import { Terms } from '../../VO/Term/Terms';
import { ITermQuery } from '../Interface/ITermQuery';
import { IMockQuery } from './Interface/IMockQuery';

export class MockTermQuery implements ITermQuery, IMockQuery {
  public readonly noun: 'TermQuery' = 'TermQuery';
  public readonly source: 'Mock' = 'Mock';

  public all(): Superposition<Terms, DataSourceError | TermError> {
    throw new UnimplementedError();
  }
}
