import { AJAX } from '../veau-general/AJAX';
import { ISessionCommand } from './interfaces/ISessionCommand';

export class SessionAJAXCommand implements ISessionCommand {
  private static instance: SessionAJAXCommand = new SessionAJAXCommand();

  public static getInstance(): SessionAJAXCommand {
    return SessionAJAXCommand.instance;
  }

  private constructor() {
  }

  public delete(): Promise<any> {
    return AJAX.delete('/api/destroy');
  }
}
