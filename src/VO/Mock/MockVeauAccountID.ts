import { UUID } from '../../General/UUID/UUID';
import { VeauAccountID } from '../VeauAccountID';

export class MockVeauAccountID extends VeauAccountID {

  public constructor(uuid: UUID = UUID.v4()) {
    super(uuid);
  }
}
