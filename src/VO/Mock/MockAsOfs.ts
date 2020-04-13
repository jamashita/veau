import { AsOfs } from '../AsOfs';
import { AsOf } from '../AsOf';
import { Sequence } from '../../General/Collection/Sequence';

export class MockAsOfs extends AsOfs {

  public constructor(...asOfs: Array<AsOf>) {
    super(Sequence.of<AsOf>(asOfs));
  }
}
