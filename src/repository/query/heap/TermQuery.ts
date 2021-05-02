import { HeapError } from '@jamashita/catacombe-heap';
import { Superposition } from '@jamashita/genitore';
import { injectable } from 'inversify';
import { TermError } from '../../../domain/vo/Term/error/TermError';
import { Terms } from '../../../domain/vo/Term/Terms';
import { ITermQuery } from '../interface/ITermQuery';
import { IHeapQuery } from './IHeapQuery';

@injectable()
export class TermQuery implements ITermQuery<HeapError>, IHeapQuery {
  public readonly noun: 'TermQuery' = 'TermQuery';
  public readonly source: 'Heap' = 'Heap';

  public all(): Superposition<Terms, HeapError | TermError> {
    return Superposition.playground<Terms, HeapError>(() => {
      return Terms.all();
    }, HeapError);
  }
}
