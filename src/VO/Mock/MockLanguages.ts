import { Languages } from '../Languages';
import { Language } from '../Language';
import { Sequence } from '../../General/Collection/Sequence';

export class MockLanguages extends Languages {

  public constructor(...languages: Array<Language>) {
    super(Sequence.of<Language>(languages));
  }
}
