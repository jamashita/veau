import { AsOfs } from '../AsOfs';
import { AsOf } from '../AsOf';
import { MockSequence } from '../../General/Collection/Mock/MockSequence';

export class MockAsOfs extends AsOfs {

  public constructor(...asOfs: Array<AsOf>) {
    super(new MockSequence<AsOf>(asOfs));
  }
}
