import { UUID } from '@jamashita/anden-uuid';
import { VeauAccountID } from '../VeauAccountID';

export class MockVeauAccountID extends VeauAccountID {
  public constructor(uuid: UUID = UUID.v4()) {
    super(uuid);
  }
}
