import { ImmutableSequence } from 'publikum';
import { Language } from '../Language';
import { Languages } from '../Languages';

export class MockLanguages extends Languages {
  public constructor(...languages: Array<Language>) {
    super(ImmutableSequence.of<Language>(languages));
  }
}
