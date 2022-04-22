import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { NoSuchElementError } from '../../repository/query/error/NoSuchElementError';
import { Page } from '../Page/Page';
import { VeauAccountID } from '../VeauAccount/VeauAccountID';
import { StatsID } from './StatsID';
import { StatsOutline } from './StatsOutline';
import { StatsOutlineError } from './StatsOutlineError';
import { StatsOutlines } from './StatsOutlines';

export interface StatsOutlineRepository<E extends DataSourceError = DataSourceError> {
  find(statsID: StatsID): Promise<Schrodinger<StatsOutline, E | NoSuchElementError | StatsOutlineError>>;

  findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Promise<Schrodinger<StatsOutlines, E | StatsOutlineError>>;
}
