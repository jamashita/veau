import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { OK } from 'http-status';
import { inject, injectable } from 'inversify';

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
export class StatsOutlineQuery implements IStatsOutlineQuery<AJAXError>, IAJAXQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(Type.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_statsID: StatsID): Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | AJAXError> {
    throw new UnimplementedError();
  }

  public findByVeauAccountID(
    _veauAccountID: VeauAccountID,
    page: Page
  ): Superposition<StatsOutlines, StatsOutlinesError | AJAXError> {
    return Superposition.playground<AJAXResponse<Array<StatsOutlineJSON>>, AJAXError>(() => {
      return this.ajax.get<Array<StatsOutlineJSON>>(`/api/stats/page/${page.get()}`);
    }, AJAXError).map<StatsOutlines, StatsOutlinesError | AJAXError>(
      ({ status, body }: AJAXResponse<Array<StatsOutlineJSON>>) => {
        switch (status) {
          case OK: {
            return StatsOutlines.ofJSON(body);
          }
          default: {
            throw new AJAXError('UNKNOWN ERROR', status);
          }
        }
      }
    );
  }
}
