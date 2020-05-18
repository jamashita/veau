import { Absent, Quantum } from 'publikum';
import { AsOf } from '../../VO/AsOf';
import { Language } from '../../VO/Language';
import { MockLanguage } from '../../VO/Mock/MockLanguage';
import { MockRegion } from '../../VO/Mock/MockRegion';
import { MockStatsOutline } from '../../VO/Mock/MockStatsOutline';
import { MockTerm } from '../../VO/Mock/MockTerm';
import { Region } from '../../VO/Region';
import { StatsOutline } from '../../VO/StatsOutline';
import { Term } from '../../VO/Term';
import { Stats } from '../Stats';
import { StatsItems } from '../StatsItems';
import { MockStatsItems } from './MockStatsItems';

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
