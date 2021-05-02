import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { EntranceInformation } from '../../domain/VO/EntranceInformation/EntranceInformation';
import { IdentityError } from '../../domain/VO/Identity/Error/IdentityError';
import { Identity } from '../../domain/VO/Identity/Identity';
import { LanguageError } from '../../domain/VO/Language/Error/LanguageError';
import { Language } from '../../domain/VO/Language/Language';
import { RegionError } from '../../domain/VO/Region/Error/RegionError';
import { Region } from '../../domain/VO/Region/Region';
import { VeauAccountError } from '../../domain/VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount } from '../../domain/VO/VeauAccount/VeauAccount';
import { NoSuchElementError } from '../Error/NoSuchElementError';
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
