import { OK } from 'http-status';
import { inject, injectable } from 'inversify';
import { TYPE } from '../../Container/Types';
import { AJAXError } from '../../General/AJAX/AJAXError';
import { AJAXResponse } from '../../General/AJAX/AJAXResponse';
import { IAJAX } from '../../General/AJAX/Interface/IAJAX';
import { DataSourceError } from '../../General/DataSourceError';
import { Failure } from '../../General/Try/Failure';
import { Success } from '../../General/Try/Success';
import { Try } from '../../General/Try/Try';
import { IAJAXCommand } from '../Interface/IAJAXCommand';
import { ISessionCommand } from '../Interface/ISessionCommand';

@injectable()
export class SessionCommand implements ISessionCommand, IAJAXCommand {
  public readonly noun: 'SessionCommand' = 'SessionCommand';
  public readonly source: 'AJAX' = 'AJAX';
  private readonly ajax: IAJAX;

  public constructor(@inject(TYPE.AJAX) ajax: IAJAX) {
    this.ajax = ajax;
  }

  public async delete(): Promise<Try<void, DataSourceError>> {
    const response: AJAXResponse<unknown> = await this.ajax.delete<unknown>('/api/destroy');

    switch (response.status) {
      case OK: {
        return Success.of<DataSourceError>();
      }
      default: {
        return Failure.of<AJAXError>(new AJAXError('UNKNOWN ERROR'));
      }
    }
  }
}
