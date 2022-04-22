import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Schrodinger } from '@jamashita/genitore-schrodinger';
import { Project } from '@jamashita/lluvia-project';
import { StatsItemID } from '../StatsItem/StatsItemID';
import { StatsID } from '../StatsOutline/StatsID';
import { StatsValue } from './StatsValue';
import { StatsValueError } from './StatsValueError';
import { StatsValues } from './StatsValues';

export interface StatsValueRepository<E extends DataSourceError = DataSourceError> {
  create(statsItemID: StatsItemID, statsValue: StatsValue): Promise<Schrodinger<unknown, E>>;

  deleteByStatsID(statsID: StatsID): Promise<Schrodinger<unknown, E>>;

  findByStatsID(statsID: StatsID): Promise<Schrodinger<Project<StatsItemID, StatsValues>, E | StatsValueError>>;
}
