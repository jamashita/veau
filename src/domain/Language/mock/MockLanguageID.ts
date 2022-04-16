import { UUID } from '@jamashita/anden-uuid';
import { LanguageID } from '../LanguageID';

export class MockLanguageID extends LanguageID {
  public constructor(uuid: UUID = UUID.v4()) {
    super(uuid);
  }
}
