import { Languages } from '../Languages';
import { Language } from '../Language';
import { MockSequence } from '../../General/Collection/Mock/MockSequence';

export class MockLanguages extends Languages {

  public constructor(...languages: Array<Language>) {
    super(new MockSequence<Language>(languages));
  }
}
