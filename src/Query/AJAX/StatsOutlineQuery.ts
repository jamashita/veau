import { AJAXError, AJAXResponse, IAJAX } from '@jamashita/publikum-ajax';
import { UnimplementedError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { Page } from '../../VO/Page/Page';
import { StatsOutlineError } from '../../VO/StatsOutline/Error/StatsOutlineError';
import { StatsID } from '../../VO/StatsOutline/StatsID';
import { StatsOutline } from '../../VO/StatsOutline/StatsOutline';
import { StatsOutlines } from '../../VO/StatsOutline/StatsOutlines';
import { VeauAccountID } from '../../VO/VeauAccount/VeauAccountID';
import { NoSuchElementError } from '../Error/NoSuchElementError';
import { IStatsOutlineQuery } from '../Interface/IStatsOutlineQuery';
import { IAJAXQuery } from './Interface/IAJAXQuery';

@injectable()
export class StatsOutlineQuery implements IStatsOutlineQuery<AJAXError>, IAJAXQuery {
  public readonly noun: 'StatsOutlineQuery' = 'StatsOutlineQuery';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX<'json'>;

  public constructor(@inject(Type.AJAX) ajax: IAJAX<'json'>) {
    this.ajax = ajax;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public find(_statsID: StatsID): Superposition<StatsOutline, StatsOutlineError | NoSuchElementError | AJAXError> {
    throw new UnimplementedError();
  }

  public findByVeauAccountID(_veauAccountID: VeauAccountID, page: Page): Superposition<StatsOutlines, StatsOutlineError | AJAXError> {
    return Superposition.playground<AJAXResponse<'json'>, AJAXError>(() => {
      return this.ajax.get(`/api/stats/page/${page.get()}`);
    }, AJAXError).map<StatsOutlines, StatsOutlineError | AJAXError>(({ status, body }: AJAXResponse<'json'>) => {
      switch (status) {
        case StatusCodes.OK: {
          if (StatsOutlines.validate(body)) {
            return StatsOutlines.ofJSON(body);
          }

          throw new StatsOutlineError('StatsOutlineQuery.findByVeauAccountID()');
        }
        default: {
          throw new AJAXError('UNKNOWN ERROR', status);
        }
      }
    }, StatsOutlineError);
  }
}
