import { UUID } from '../../veau-general/UUID/UUID';
import { VeauAccountID } from '../VeauAccountID';

const certain = (uuid?: UUID): UUID => {
  if (uuid === undefined) {
    return UUID.v4();
  }

  return uuid;
};

export class MockVeauAccountID extends VeauAccountID {

  public constructor(uuid?: UUID) {
    super(certain(uuid));
  }
}
