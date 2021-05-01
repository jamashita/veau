import { UUID } from '@jamashita/anden-uuid';
import { LanguageID } from '../../Language/LanguageID';
import { MockLanguageID } from '../../Language/Mock/MockLanguageID';
import { MockRegionID } from '../../Region/Mock/MockRegionID';
import { RegionID } from '../../Region/RegionID';
import { TermID } from '../../Term/TermID';
import { StatsID } from '../StatsID';
import { StatsName } from '../StatsName';
import { StatsOutline } from '../StatsOutline';
import { StatsUnit } from '../StatsUnit';
import { UpdatedAt } from '../UpdatedAt';
import { MockStatsID } from './MockStatsID';
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
    termID = TermID.of(UUID.v4()),
    name = StatsName.empty(),
    unit = StatsUnit.empty(),
    updatedAt = new MockUpdatedAt()
  }: StatsOutlineArgs = {}) {
    super(statsID, languageID, regionID, termID, name, unit, updatedAt);
  }
}
