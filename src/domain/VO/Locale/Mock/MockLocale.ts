import { Language } from '../../Language/Language';
import { Languages } from '../../Language/Languages';
import { Region } from '../../Region/Region';
import { Regions } from '../../Region/Regions';
import { Locale } from '../Locale';

type LocaleArgs = Partial<Readonly<{
  languages: ReadonlyArray<Language>;
  regions: ReadonlyArray<Region>;
}>>;

export class MockLocale extends Locale {
  public constructor({ languages = [], regions = [] }: LocaleArgs = {}) {
    super(Languages.ofArray([...languages]), Regions.ofArray([...regions]));
  }
}
