import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { Page } from '../../../domain/vo/Page/Page.js';
import { StatsOutlineError } from '../../../domain/vo/StatsOutline/error/StatsOutlineError.js';
import { StatsID } from '../../../domain/vo/StatsOutline/StatsID.js';
import { StatsOutline } from '../../../domain/vo/StatsOutline/StatsOutline.js';
import { StatsOutlines } from '../../../domain/vo/StatsOutline/StatsOutlines.js';
import { VeauAccountID } from '../../../domain/vo/VeauAccount/VeauAccountID.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { IQuery } from './IQuery.js';

export interface IStatsOutlineQuery<E extends DataSourceError = DataSourceError> extends IQuery<'StatsOutlineQuery'> {
  readonly noun: 'StatsOutlineQuery';

  find(statsID: StatsID): Superposition<StatsOutline, E | NoSuchElementError | StatsOutlineError>;

  findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Superposition<StatsOutlines, E | StatsOutlineError>;
}
