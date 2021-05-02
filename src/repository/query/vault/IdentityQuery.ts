import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types';
import { EntranceInformation } from '../../../domain/vo/EntranceInformation/EntranceInformation';
import { IdentityError } from '../../../domain/vo/Identity/error/IdentityError';
import { Identity } from '../../../domain/vo/Identity/Identity';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError';
import { Language } from '../../../domain/vo/Language/Language';
import { RegionError } from '../../../domain/vo/Region/error/RegionError';
import { Region } from '../../../domain/vo/Region/Region';
import { VeauAccountError } from '../../../domain/vo/VeauAccount/error/VeauAccountError';
import { VeauAccount } from '../../../domain/vo/VeauAccount/VeauAccount';
import { NoSuchElementError } from '../error/NoSuchElementError';
import { IIdentityQuery } from '../Interface/IIdentityQuery';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { IRegionQuery } from '../Interface/IRegionQuery';
import { IVeauAccountQuery } from '../Interface/IVeauAccountQuery';
import { IVaultQuery } from './Interface/IVaultQuery';

@injectable()
export class IdentityQuery implements IIdentityQuery, IVaultQuery {
  public readonly noun: 'IdentityQuery' = 'IdentityQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly accountQuery: IVeauAccountQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;

  public constructor(
    @inject(Type.VeauAccountFetchQuery) accountQuery: IVeauAccountQuery,
    @inject(Type.LanguageVaultQuery) languageQuery: ILanguageQuery,
    @inject(Type.RegionVaultQuery) regionQuery: IRegionQuery
  ) {
    this.accountQuery = accountQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
  }

  public find(): Superposition<Identity, DataSourceError | IdentityError> {
    return this.accountQuery.find().map<Identity, DataSourceError | LanguageError | NoSuchElementError | RegionError | VeauAccountError>((veauAccount: VeauAccount) => {
      return this.languageQuery.find(veauAccount.getLanguageID()).map<Identity, DataSourceError | LanguageError | NoSuchElementError | RegionError>((language: Language) => {
        return this.regionQuery.find(veauAccount.getRegionID()).map<Identity, DataSourceError | NoSuchElementError | RegionError>((region: Region) => {
          return Identity.of(veauAccount.getVeauAccountID(), veauAccount.getAccountName(), language, region);
        });
      });
    }).recover<Identity, DataSourceError | IdentityError>((err: DataSourceError | LanguageError | NoSuchElementError | RegionError | VeauAccountError) => {
      if (err instanceof DataSourceError) {
        throw err;
      }

      throw new IdentityError('IdentityQuery.find()', err);
    }, IdentityError, DataSourceError);
  }

  public findByEntranceInfo(entranceInformation: EntranceInformation): Superposition<Identity, DataSourceError | IdentityError> {
    return this.accountQuery.findByEntranceInfo(entranceInformation).map<Identity, DataSourceError | LanguageError | NoSuchElementError | RegionError | VeauAccountError>((veauAccount: VeauAccount) => {
      return this.languageQuery.find(veauAccount.getLanguageID()).map<Identity, DataSourceError | LanguageError | NoSuchElementError | RegionError>((language: Language) => {
        return this.regionQuery.find(veauAccount.getRegionID()).map<Identity, DataSourceError | NoSuchElementError | RegionError>((region: Region) => {
          return Identity.of(veauAccount.getVeauAccountID(), veauAccount.getAccountName(), language, region);
        });
      });
    }).recover<Identity, DataSourceError | IdentityError>((err: DataSourceError | LanguageError | NoSuchElementError | RegionError | VeauAccountError) => {
      if (err instanceof DataSourceError) {
        throw err;
      }

      throw new IdentityError('IdentityQuery.find()', err);
    }, IdentityError, DataSourceError);
  }
}
