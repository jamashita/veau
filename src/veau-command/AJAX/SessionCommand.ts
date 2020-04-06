import { OK } from 'http-status';
import { injectable } from 'inversify';
import { AJAXError } from '../../veau-error/AJAXError';
import { AJAX, AJAXResponse } from '../../veau-general/AJAX';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { IAJAXCommand } from '../interfaces/IAJAXCommand';
import { ISessionCommand } from '../interfaces/ISessionCommand';

@injectable()
export class SessionCommand implements ISessionCommand, IAJAXCommand {
  public readonly noun: 'SessionCommand' = 'SessionCommand';
  public readonly source: 'AJAX' = 'AJAX';

  public async delete(): Promise<Try<void, AJAXError>> {
    const response: AJAXResponse<unknown> = await AJAX.delete<unknown>('/api/destroy');

    switch (response.status) {
      case OK: {
        return Success.of<void, AJAXError>(undefined);
      }
      default: {
        return Failure.of<void, AJAXError>(new AJAXError('UNKNOWN ERROR'));
      }
    }
  }
}
