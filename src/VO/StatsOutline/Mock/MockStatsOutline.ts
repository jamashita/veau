import { LanguageID } from '../../Language/LanguageID';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { MockStatsID } from './MockStatsID';
import { MockStatsName } from './MockStatsName';
import { MockStatsUnit } from './MockStatsUnit';
import { MockUpdatedAt } from './MockUpdatedAt';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { RegionID } from '../../Region/RegionID';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsUnit } from '../StatsUnit';
import { MockTermID } from '../../Term/Mock/MockTermID';
import { TermID } from '../../Term/TermID';
import { UpdatedAt } from '../UpdatedAt';
import { StatsOutline } from '../StatsOutline';

type StatsOutlineArgs = Partial<
  Readonly<{
    statsID: StatsID;
    languageID: LanguageID;
    regionID: RegionID;
    termID: TermID;
    name: StatsName;
    unit: StatsUnit;
    updatedAt: UpdatedAt;
  }>
>;

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
