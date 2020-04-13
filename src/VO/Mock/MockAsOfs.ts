import { AsOfs } from '../AsOfs';
import { AsOf } from '../AsOf';
import { ImmutableSequence } from '../../General/Collection/ImmutableSequence';

export class MockAsOfs extends AsOfs {

  public constructor(...asOfs: Array<AsOf>) {
    super(ImmutableSequence.of<AsOf>(asOfs));
  }
}
