import { OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { AJAXError, AJAXResponse, DataSourceError, Dead, IAJAX, Superposition } from 'publikum';
import { TYPE } from '../../Container/Types';
import { StatsOutlinesError } from '../../Error/StatsOutlinesError';
import { Page } from '../../VO/Page';
import { StatsOutlineJSON } from '../../VO/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccountID';
import { IAJAXQuery } from '../Interface/IAJAXQuery';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';

@injectable()
export class StatsOutlineQuery implements IStatsOutlineQuery, IAJAXQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(TYPE.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async findByVeauAccountID(
    veauAccountID: VeauAccountID,
    page: Page
  ): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>> {
    const response: AJAXResponse<Array<StatsOutlineJSON>> = await this.ajax.get<Array<StatsOutlineJSON>>(`/api/stats/page/${page.get()}`);
    const {
      status,
      body
    } = response;

    switch (status) {
      case OK: {
        return StatsOutlines.ofJSON(body);
      }
      default: {
        return Dead.of<StatsOutlines, AJAXError>(new AJAXError('UNKNOWN ERROR', status));
      }
    }
  }
}
