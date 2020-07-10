import { injectable } from 'inversify';

import { CacheError } from '@jamashita/publikum-cache';
import { Superposition } from '@jamashita/publikum-monad';

import { TermsError } from '../../VO/Term/Error/TermsError';
import { Terms } from '../../VO/Term/Terms';
import { ITermQuery } from '../Interface/ITermQuery';
import { ICacheQuery } from './Interface/ICacheQuery';

@injectable()
export class TermQuery implements ITermQuery<CacheError>, ICacheQuery {
  public readonly noun: 'TermQuery' = 'TermQuery';
  public readonly source: 'Cache' = 'Cache';

  public all(): Superposition<Terms, TermsError | CacheError> {
    return Superposition.playground<Terms, TermsError>(() => {
      return Terms.all();
    }, TermsError);
  }
}
