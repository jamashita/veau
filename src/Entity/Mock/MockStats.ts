import { Absent, Quantum } from 'publikum';
import { AsOf } from '../../VO/AsOf';
import { LanguageID } from '../../VO/LanguageID';
import { MockLanguageID } from '../../VO/Mock/MockLanguageID';
import { MockRegionID } from '../../VO/Mock/MockRegionID';
import { MockStatsID } from '../../VO/Mock/MockStatsID';
import { MockStatsName } from '../../VO/Mock/MockStatsName';
import { MockStatsUnit } from '../../VO/Mock/MockStatsUnit';
import { MockTerm } from '../../VO/Mock/MockTerm';
import { MockUpdatedAt } from '../../VO/Mock/MockUpdatedAt';
import { RegionID } from '../../VO/RegionID';
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
  languageID: LanguageID;
  regionID: RegionID;
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
    languageID = new MockLanguageID(),
    regionID = new MockRegionID(),
    term = new MockTerm(),
    name = new MockStatsName(),
    unit = new MockStatsUnit(),
    updatedAt = new MockUpdatedAt(),
    items = new MockStatsItems(),
    startDate = Absent.of<AsOf>()
  }: StatsArgs = {}) {
    super(
      statsID,
      languageID,
      regionID,
      term,
      name,
      unit,
      updatedAt,
      items,
      startDate
    );
  }
}
