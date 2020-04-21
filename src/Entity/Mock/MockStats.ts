import { Absent } from '../../General/Quantum/Absent';
import { Quantum } from '../../General/Quantum/Quantum';
import { AsOf } from '../../VO/AsOf';
import { Language } from '../../VO/Language';
import { MockLanguage } from '../../VO/Mock/MockLanguage';
import { MockRegion } from '../../VO/Mock/MockRegion';
import { MockStatsID } from '../../VO/Mock/MockStatsID';
import { MockStatsName } from '../../VO/Mock/MockStatsName';
import { MockStatsUnit } from '../../VO/Mock/MockStatsUnit';
import { MockTerm } from '../../VO/Mock/MockTerm';
import { MockUpdatedAt } from '../../VO/Mock/MockUpdatedAt';
import { Region } from '../../VO/Region';
import { StatsID } from '../../VO/StatsID';
import { StatsName } from '../../VO/StatsName';
import { StatsUnit } from '../../VO/StatsUnit';
import { Term } from '../../VO/Term';
import { UpdatedAt } from '../../VO/UpdatedAt';
import { Stats } from '../Stats';
import { StatsItems } from '../StatsItems';
import { MockStatsItems } from './MockStatsItems';

type StatsArgs = Partial<Readonly<{
  statsID: StatsID;
  language: Language;
  region: Region;
  term: Term;
  name: StatsName;
  unit: StatsUnit;
  updatedAt: UpdatedAt;
  items: StatsItems;
  startDate: Quantum<AsOf>;
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
    startDate = Absent.of<AsOf>()
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
