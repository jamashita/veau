import { UUID } from '@jamashita/anden-uuid';
import { TermID } from '../TermID';

export class MockTermID extends TermID {
  public constructor(uuid: UUID = UUID.v4()) {
    super(uuid);
  }
}
