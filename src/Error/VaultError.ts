import { DataSourceError } from '@jamashita/publikum-error';

export class VaultError extends DataSourceError<'VaultError', 'Vault'> {
  public readonly noun: 'VaultError' = 'VaultError';
  public readonly source: 'Vault' = 'Vault';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
