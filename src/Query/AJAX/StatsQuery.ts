import { NO_CONTENT, OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { AJAXError, AJAXResponse, DataSourceError, Dead, IAJAX, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
import { Stats, StatsJSON } from '../../Entity/Stats/Stats';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { StatsError } from '../../Error/StatsError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
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

  public async findByStatsID(
    statsID: StatsID
  ): Promise<Superposition<Stats, StatsError | NoSuchElementError | DataSourceError>> {
    const response: AJAXResponse<StatsJSON> = await this.ajax.get<StatsJSON>(`/api/stats/${statsID.get().get()}`);
    // prettier-ignore
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return Stats.ofJSON(body);
      }
      case NO_CONTENT: {
        return Dead.of<Stats, NoSuchElementError>(new NoSuchElementError('NOT FOUND'));
      }
      default: {
        return Dead.of<Stats, AJAXError>(new AJAXError('UNKNOWN ERROR', status));
      }
    }
  }
}
