import { NO_CONTENT, OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { Stats, StatsJSON } from '../../Entity/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { AJAXError } from '../../General/AJAX/AJAXError';
import { AJAXResponse } from '../../General/AJAX/AJAXResponse';
import { IAJAX } from '../../General/AJAX/Interface/IAJAX';
import { DataSourceError } from '../../General/DataSourceError';
import { Failure } from '../../General/Try/Failure';
import { Try } from '../../General/Try/Try';
import { StatsID } from '../../VO/StatsID';
import { IAJAXQuery } from '../Interface/IAJAXQuery';
import { IStatsQuery } from '../Interface/IStatsQuery';

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
        return Failure.of<Stats, AJAXError>(new AJAXError('UNKNOWN ERROR', status));
      }
    }
  }
}
