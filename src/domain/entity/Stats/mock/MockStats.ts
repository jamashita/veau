import { Nullable } from '@jamashita/anden-type';
import { AsOf } from '../../../vo/AsOf/AsOf';
import { Language } from '../../../vo/Language/Language';
import { MockLanguage } from '../../../vo/Language/mock/MockLanguage';
import { MockRegion } from '../../../vo/Region/mock/MockRegion';
import { Region } from '../../../vo/Region/Region';
import { MockStatsOutline } from '../../../vo/StatsOutline/mock/MockStatsOutline';
import { StatsOutline } from '../../../vo/StatsOutline/StatsOutline';
import { Term } from '../../../vo/Term/Term';
import { MockStatsItems } from '../../StatsItem/mock/MockStatsItems';
import { StatsItems } from '../../StatsItem/StatsItems';
import { Stats } from '../Stats';

type StatsArgs = Partial<Readonly<{
  outline: StatsOutline;
  language: Language;
  region: Region;
  term: Term;
  items: StatsItems;
  startDate: Nullable<AsOf>;
}>>;

export class MockStats extends Stats {
  public constructor({
    outline = new MockStatsOutline(),
    language = new MockLanguage(),
    region = new MockRegion(),
    term = Term.ANNUAL,
    items = new MockStatsItems(),
    startDate = null
  }: StatsArgs = {}) {
    super(outline, language, region, term, items, startDate);
  }
}
