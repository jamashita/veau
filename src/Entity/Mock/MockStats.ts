import { Stats } from '../Stats';
import { StatsID } from '../../VO/StatsID';
import { Region } from '../../VO/Region';
import { Language } from '../../VO/Language';
import { Term } from '../../VO/Term';
import { StatsName } from '../../VO/StatsName';
import { StatsUnit } from '../../VO/StatsUnit';
import { UpdatedAt } from '../../VO/UpdatedAt';
import { StatsItems } from '../StatsItems';
import { Optional } from '../../General/Optional/Optional';
import { AsOf } from '../../VO/AsOf';
import { MockStatsID } from '../../VO/Mock/MockStatsID';
import { MockLanguage } from '../../VO/Mock/MockLanguage';
import { MockRegion } from '../../VO/Mock/MockRegion';
import { MockTerm } from '../../VO/Mock/MockTerm';
import { MockStatsName } from '../../VO/Mock/MockStatsName';
import { MockStatsUnit } from '../../VO/Mock/MockStatsUnit';
import { MockUpdatedAt } from '../../VO/Mock/MockUpdatedAt';
import { MockStatsItems } from './MockStatsItems';
import { None } from '../../General/Optional/None';

type StatsArgs = Partial<Readonly<{
  statsID: StatsID;
  language: Language;
  region: Region;
  term: Term;
  name: StatsName;
  unit: StatsUnit;
  updatedAt: UpdatedAt;
  items: StatsItems;
  startDate: Optional<AsOf>;
}>>;

export class MockStats extends Stats {

  public constructor({
    statsID = new MockStatsID(),
    language = new MockLanguage(),
    region = new MockRegion(),
    term = new MockTerm(),
    name = new MockStatsName(),
    unit = new MockStatsUnit(),
    updatedAt = new MockUpdatedAt(),
    items = new MockStatsItems(),
    startDate = None.of<AsOf>()
  }: StatsArgs = {}) {
    super(
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt,
      items,
      startDate
    );
  }
}
