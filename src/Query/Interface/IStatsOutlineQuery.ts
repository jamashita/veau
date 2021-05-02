import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { Page } from '../../domain/VO/Page/Page';
import { StatsOutlineError } from '../../domain/VO/StatsOutline/Error/StatsOutlineError';
import { StatsID } from '../../domain/VO/StatsOutline/StatsID';
import { StatsOutline } from '../../domain/VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../domain/VO/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../../domain/VO/VeauAccount/VeauAccountID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IQuery } from './IQuery';

export interface IStatsOutlineQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsOutlineQuery'> {
  readonly noun: 'StatsOutlineQuery';

  find(statsID: StatsID): Superposition<StatsOutline, E | NoSuchElementError | StatsOutlineError>;

  findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsOutlines, E | StatsOutlineError>;
}
