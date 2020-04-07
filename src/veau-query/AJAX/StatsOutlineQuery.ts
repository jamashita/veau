import { OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../veau-container/Types';
import { StatsOutlinesError } from '../../veau-error/StatsOutlinesError';
import { AJAXError } from '../../veau-general/AJAX/AJAXError';
import { AJAXResponse } from '../../veau-general/AJAX/AJAXResponse';
import { IAJAX } from '../../veau-general/AJAX/interfaces/IAJAX';
import { DataSourceError } from '../../veau-general/DataSourceError';
import { Failure } from '../../veau-general/Try/Failure';
import { Try } from '../../veau-general/Try/Try';
import { Page } from '../../veau-vo/Page';
import { StatsOutlineJSON } from '../../veau-vo/StatsOutline';
import { StatsOutlines } from '../../veau-vo/StatsOutlines';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { IAJAXQuery } from '../interfaces/IAJAXQuery';
import { IStatsOutlineQuery } from '../interfaces/IStatsOutlineQuery';

@injectable()
export class StatsOutlineQuery implements IStatsOutlineQuery, IAJAXQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(TYPE.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async findByVeauAccountID(veauAccountID: VeauAccountID, page: Page): Promise<Try<StatsOutlines, StatsOutlinesError | DataSourceError>> {
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
        return Failure.of<StatsOutlines, AJAXError>(new AJAXError('UNKNOWN ERROR'));
      }
    }
  }
}
