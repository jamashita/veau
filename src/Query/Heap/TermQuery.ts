import { HeapError } from '@jamashita/catacombe-heap';
import { Superposition } from '@jamashita/genitore';
import { injectable } from 'inversify';
import { TermError } from '../../VO/Term/Error/TermError';
import { Terms } from '../../VO/Term/Terms';
import { ITermQuery } from '../Interface/ITermQuery';
import { IHeapQuery } from './Interface/IHeapQuery';

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