import { Languages } from '../../Language/Languages';
import { MockLanguages } from '../../Language/Mock/MockLanguages';
import { Locale } from '../Locale';
import { MockRegions } from '../../Region/Mock/MockRegions';
import { Regions } from '../../Region/Regions';

type LocaleArgs = Partial<
  Readonly<{
    languages: Languages;
    regions: Regions;
  }>
>;

export class MockLocale extends Locale {
  public constructor({ languages = new MockLanguages(), regions = new MockRegions() }: LocaleArgs = {}) {
    super(languages, regions);
  }
}
