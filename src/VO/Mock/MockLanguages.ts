import { Languages } from '../Languages';
import { Language } from '../Language';
import { ImmutableSequence } from '../../General/Collection/ImmutableSequence';

export class MockLanguages extends Languages {

  public constructor(...languages: Array<Language>) {
    super(ImmutableSequence.of<Language>(languages));
  }
}
