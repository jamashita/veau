import { HeapError } from '@jamashita/catacombe-heap';
import { Superposition } from '@jamashita/genitore-superposition';
import { injectable } from 'inversify';
import { TermError } from '../../../domain/vo/Term/error/TermError.js';
import { Terms } from '../../../domain/vo/Term/Terms.js';
import { ITermQuery } from '../ITermQuery.js';
import { IHeapQuery } from './IHeapQuery.js';

@injectable()
export class TermHeapQuery implements ITermQuery<HeapError>, IHeapQuery {
  public readonly noun: 'TermQuery' = 'TermQuery';
  public readonly source: 'Heap' = 'Heap';

  public all(): Superposition<Terms, HeapError | TermError> {
    return Superposition.alive<Terms, HeapError>(Terms.all(), HeapError);
  }
}
