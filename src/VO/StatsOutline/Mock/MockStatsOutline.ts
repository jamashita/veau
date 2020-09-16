import { LanguageID } from '../../Language/LanguageID';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { RegionID } from '../../Region/RegionID';
import { MockTermID } from '../../Term/Mock/MockTermID';
import { TermID } from '../../Term/TermID';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsOutline } from '../StatsOutline';
import { StatsUnit } from '../StatsUnit';
import { UpdatedAt } from '../UpdatedAt';
import { MockStatsID } from './MockStatsID';
import { MockStatsName } from './MockStatsName';
import { MockStatsUnit } from './MockStatsUnit';
import { MockUpdatedAt } from './MockUpdatedAt';

type StatsOutlineArgs = Partial<Readonly<{
  statsID: StatsID;
  languageID: LanguageID;
  regionID: RegionID;
  termID: TermID;
  name: StatsName;
  unit: StatsUnit;
  updatedAt: UpdatedAt;
}>>;

export class MockStatsOutline extends StatsOutline {
  public constructor({
    statsID = new MockStatsID(),
    languageID = new MockLanguageID(),
    regionID = new MockRegionID(),
    termID = new MockTermID(),
    name = new MockStatsName(),
    unit = new MockStatsUnit(),
    updatedAt = new MockUpdatedAt()
  }: StatsOutlineArgs = {}) {
    super(statsID, languageID, regionID, termID, name, unit, updatedAt);
  }
}
