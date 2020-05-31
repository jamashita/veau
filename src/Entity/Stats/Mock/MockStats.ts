import { Absent, Quantum } from '@jamashita/publikum-monad';

import { AsOf } from '../../../VO/AsOf/AsOf';
import { Language } from '../../../VO/Language/Language';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { Region } from '../../../VO/Region/Region';
import { MockStatsOutline } from '../../../VO/StatsOutline/Mock/MockStatsOutline';
import { StatsOutline } from '../../../VO/StatsOutline/StatsOutline';
import { MockTerm } from '../../../VO/Term/Mock/MockTerm';
import { Term } from '../../../VO/Term/Term';
import { MockStatsItems } from '../../StatsItem/Mock/MockStatsItems';
import { StatsItems } from '../../StatsItem/StatsItems';
import { Stats } from '../Stats';

type StatsArgs = Partial<
  Readonly<{
    outline: StatsOutline;
    language: Language;
    region: Region;
    term: Term;
    items: StatsItems;
    startDate: Quantum<AsOf>;
  }>
>;

export class MockStats extends Stats {
  public constructor({
    outline = new MockStatsOutline(),
    language = new MockLanguage(),
    region = new MockRegion(),
    term = new MockTerm(),
    items = new MockStatsItems(),
    startDate = Absent.of<AsOf>()
  }: StatsArgs = {}) {
    super(outline, language, region, term, items, startDate);
  }
}
