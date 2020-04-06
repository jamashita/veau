import { SourceError } from '../SourceError';

export class AJAXError extends SourceError {
  public readonly name: 'AJAXError' = 'AJAXError';

  public constructor(message: string) {
    super(message);
  }
}
