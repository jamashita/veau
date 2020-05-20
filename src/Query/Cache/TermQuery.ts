import { injectable } from 'inversify';
import { Alive, DataSourceError, Superposition } from 'publikum';

import { TermsError } from '../../VO/Term/Error/TermsError';
import { Terms } from '../../VO/Term/Terms';
import { ITermQuery } from '../Interface/ITermQuery';
import { ICacheQuery } from './Interface/ICacheQuery';

@injectable()
export class TermQuery implements ITermQuery, ICacheQuery {
  public readonly noun: 'TermQuery' = 'TermQuery';
  public readonly source: 'Cache' = 'Cache';

  public all(): Promise<Superposition<Terms, TermsError | DataSourceError>> {
    return Promise.resolve<Superposition<Terms, TermsError>>(Alive.of<Terms, TermsError>(Terms.all()));
  }
}
