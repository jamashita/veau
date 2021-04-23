import { DataSourceError } from '@jamashita/anden-error';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../Container/Types';
import { EntranceInformation } from '../../VO/EntranceInformation/EntranceInformation';
import { IdentityError } from '../../VO/Identity/Error/IdentityError';
import { Identity } from '../../VO/Identity/Identity';
import { LanguageError } from '../../VO/Language/Error/LanguageError';
import { Language } from '../../VO/Language/Language';
import { RegionError } from '../../VO/Region/Error/RegionError';
import { Region } from '../../VO/Region/Region';
import { VeauAccountError } from '../../VO/VeauAccount/Error/VeauAccountError';
import { VeauAccount } from '../../VO/VeauAccount/VeauAccount';
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

  public find(): Superposition<Identity, IdentityError | DataSourceError> {
    return this.accountQuery.find().map<Identity, VeauAccountError | LanguageError | RegionError | NoSuchElementError | DataSourceError>((veauAccount: VeauAccount) => {
      return this.languageQuery.find(veauAccount.getLanguageID()).map<Identity, LanguageError | RegionError | NoSuchElementError | DataSourceError>((language: Language) => {
        return this.regionQuery.find(veauAccount.getRegionID()).map<Identity, RegionError | NoSuchElementError | DataSourceError>((region: Region) => {
          return Identity.of(veauAccount.getVeauAccountID(), veauAccount.getAccountName(), language, region);
        });
      });
    }).recover<Identity, IdentityError | DataSourceError>((err: VeauAccountError | LanguageError | RegionError | NoSuchElementError | DataSourceError) => {
      if (err instanceof DataSourceError) {
        throw err;
      }

      throw new IdentityError('IdentityQuery.find()', err);
    }, IdentityError, DataSourceError);
  }

  public findByEntranceInfo(entranceInformation: EntranceInformation): Superposition<Identity, IdentityError | DataSourceError> {
    return this.accountQuery.findByEntranceInfo(entranceInformation).map<Identity, VeauAccountError | LanguageError | RegionError | NoSuchElementError | DataSourceError>((veauAccount: VeauAccount) => {
      return this.languageQuery.find(veauAccount.getLanguageID()).map<Identity, LanguageError | RegionError | NoSuchElementError | DataSourceError>((language: Language) => {
        return this.regionQuery.find(veauAccount.getRegionID()).map<Identity, RegionError | NoSuchElementError | DataSourceError>((region: Region) => {
          return Identity.of(veauAccount.getVeauAccountID(), veauAccount.getAccountName(), language, region);
        });
      });
    }).recover<Identity, IdentityError | DataSourceError>((err: VeauAccountError | LanguageError | RegionError | NoSuchElementError | DataSourceError) => {
      if (err instanceof DataSourceError) {
        throw err;
      }

      throw new IdentityError('IdentityQuery.find()', err);
    }, IdentityError, DataSourceError);
  }
}
