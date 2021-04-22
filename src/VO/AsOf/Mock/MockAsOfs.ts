import { ImmutableSequence } from '@jamashita/lluvia-collection';
import { AsOf } from '../AsOf';
import { AsOfs } from '../AsOfs';

export class MockAsOfs extends AsOfs {
  public constructor(...asOfs: ReadonlyArray<AsOf>) {
    super(ImmutableSequence.ofArray<AsOf>([...asOfs]));
  }
}
