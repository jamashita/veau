import { CacheError } from '@jamashita/publikum-cache';
import { Superposition } from '@jamashita/publikum-monad';
import { injectable } from 'inversify';
import { TermError } from '../../VO/Term/Error/TermError';
import { Terms } from '../../VO/Term/Terms';
import { ITermQuery } from '../Interface/ITermQuery';
import { ICacheQuery } from './Interface/ICacheQuery';

@injectable()
export class TermQuery implements ITermQuery<CacheError>, ICacheQuery {
  public readonly noun: 'TermQuery' = 'TermQuery';
  public readonly source: 'Cache' = 'Cache';

  public all(): Superposition<Terms, TermError | CacheError> {
    return Superposition.playground<Terms, CacheError>(() => {
      return Terms.all();
    }, CacheError);
  }
}
