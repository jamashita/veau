import { AJAX } from '../../veau-general/AJAX';

export class SessionCommand {
  private static instance: SessionCommand = new SessionCommand();

  public static getInstance(): SessionCommand {
    return SessionCommand.instance;
  }

  private constructor() {
  }

  public delete(): Promise<unknown> {
    return AJAX.delete<unknown>('/api/destroy');
  }
}
