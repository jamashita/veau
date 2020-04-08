import { NO_CONTENT, OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { Stats, StatsJSON } from '../../veau-entity/Stats';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { StatsError } from '../../veau-error/StatsError';
import { AJAXError } from '../../veau-general/AJAX/AJAXError';
import { AJAXResponse } from '../../veau-general/AJAX/AJAXResponse';
import { IAJAX } from '../../veau-general/AJAX/interfaces/IAJAX';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Failure } from '../../veau-general/Try/Failure';
import { Try } from '../../veau-general/Try/Try';
import { StatsID } from '../../veau-vo/StatsID';
import { IAJAXQuery } from '../interfaces/IAJAXQuery';
import { IStatsQuery } from '../interfaces/IStatsQuery';

@injectable()
export class StatsQuery implements IStatsQuery, IAJAXQuery {
  public readonly noun: 'StatsQuery' = 'StatsQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(TYPE.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async findByStatsID(statsID: StatsID): Promise<Try<Stats, StatsError | NoSuchElementError | DataSourceError>> {
    const response: AJAXResponse<StatsJSON> = await this.ajax.get<StatsJSON>(`/api/stats/${statsID.get().get()}`);
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return Stats.ofJSON(body);
      }
      case NO_CONTENT: {
        return Failure.of<Stats, NoSuchElementError>(new NoSuchElementError('NOT FOUND'));
      }
      default: {
        return Failure.of<Stats, AJAXError>(new AJAXError('UNKNOWN ERROR'));
      }
    }
  }
}
