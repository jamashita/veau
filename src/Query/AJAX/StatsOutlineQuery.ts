import { OK } from 'http-status';
import { inject, injectable } from 'inversify';

import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { DataSourceError, UnimplementedError } from '@jamashita/publikum-error';
import { Dead, Superposition } from '@jamashita/publikum-monad';

import { Type } from '../../Container/Types';
import { Page } from '../../VO/Page/Page';
import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsOutlinesError } from '../../VO/StatsOutline/Error/StatsOutlinesError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsOutline, StatsOutlineJSON } from '../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';
import { IAJAXQuery } from './Interface/IAJAXQuery';

@injectable()
export class StatsOutlineQuery implements IStatsOutlineQuery, IAJAXQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(Type.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public find(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    statsID: StatsID
  ): Promise<Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>> {
    return Promise.reject<Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | DataSourceError>>(
      new UnimplementedError()
    );
  }

  public async findByVeauAccountID(
    veauAccountID: VeauAccountID,
    page: Page
  ): Promise<Superposition<StatsOutlines, StatsOutlinesError | DataSourceError>> {
    const response: AJAXResponse<Array<StatsOutlineJSON>> = await this.ajax.get<Array<StatsOutlineJSON>>(
      `/api/stats/page/${page.get()}`
    );
    // prettier-ignore
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
