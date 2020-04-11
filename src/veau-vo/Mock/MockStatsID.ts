import { StatsID } from '../StatsID';
import { UUID } from '../../veau-general/UUID/UUID';

export class MockStatsID extends StatsID {

  public constructor(uuid: UUID = UUID.v4()) {
    super(uuid);
  }
}
