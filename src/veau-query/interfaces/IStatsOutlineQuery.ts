import { StatsOutlinesError } from '../../veau-error/StatsOutlinesError';
import { Try } from '../../veau-general/Try/Try';
import { Limit } from '../../veau-vo/Limit';
import { Offset } from '../../veau-vo/Offset';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';

export interface IStatsOutlineQuery {

  findByVeauAccountID(veauAccountID: VeauAccountID, limit: Limit, offset: Offset): Promise<Try<StatsOutlines, StatsOutlinesError>>;
}
