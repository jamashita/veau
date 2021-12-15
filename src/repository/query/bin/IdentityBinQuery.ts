import { DataSourceError } from '@jamashita/catacombe-datasource';
import { Superposition } from '@jamashita/genitore-superposition';
import { inject, injectable } from 'inversify';
import { Type } from '../../../container/Types.js';
import { EntranceInformation } from '../../../domain/vo/EntranceInformation/EntranceInformation.js';
import { IdentityError } from '../../../domain/vo/Identity/error/IdentityError.js';
import { Identity } from '../../../domain/vo/Identity/Identity.js';
import { LanguageError } from '../../../domain/vo/Language/error/LanguageError.js';
import { Language } from '../../../domain/vo/Language/Language.js';
import { RegionError } from '../../../domain/vo/Region/error/RegionError.js';
import { Region } from '../../../domain/vo/Region/Region.js';
import { VeauAccountError } from '../../../domain/vo/VeauAccount/error/VeauAccountError.js';
import { VeauAccount } from '../../../domain/vo/VeauAccount/VeauAccount.js';
import { NoSuchElementError } from '../error/NoSuchElementError.js';
import { IIdentityQuery } from '../IIdentityQuery.js';
import { ILanguageQuery } from '../ILanguageQuery.js';
import { IRegionQuery } from '../IRegionQuery.js';
import { IVeauAccountQuery } from '../IVeauAccountQuery.js';
import { IBinQuery } from './IBinQuery.js';

@injectable()
export class IdentityBinQuery implements IIdentityQuery, IBinQuery {
  public readonly noun: 'IdentityQuery' = 'IdentityQuery';
  public readonly source: 'Bin' = 'Bin';
  private readonly accountQuery: IVeauAccountQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery;

  public constructor(
    @inject(Type.VeauAccountFetchQuery) accountQuery: IVeauAccountQuery,
    @inject(Type.LanguageBinQuery) languageQuery: ILanguageQuery,
    @inject(Type.RegionBinQuery) regionQuery: IRegionQuery
  ) {
    this.accountQuery = accountQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
  }

  public find(): Superposition<Identity, DataSourceError | IdentityError> {
    return this.accountQuery.find().map<Identity, DataSourceError | LanguageError | NoSuchElementError | RegionError | VeauAccountError>((veauAccount: VeauAccount) => {
      // TODO SIMULTANEOUSLY
      return this.languageQuery.find(veauAccount.getLanguageID()).map<Identity, DataSourceError | LanguageError | NoSuchElementError | RegionError>((language: Language) => {
        return this.regionQuery.find(veauAccount.getRegionID()).map<Identity, DataSourceError | NoSuchElementError | RegionError>((region: Region) => {
          return Identity.of(veauAccount.getVeauAccountID(), veauAccount.getAccountName(), language, region);
        });
      });
    }).recover<Identity, DataSourceError | IdentityError>((err: DataSourceError | LanguageError | NoSuchElementError | RegionError | VeauAccountError) => {
      if (err instanceof DataSourceError) {
        throw err;
      }

      throw new IdentityError('IdentityBinQuery.find()', err);
    }, IdentityError, DataSourceError);
  }

  public findByEntranceInfo(entranceInformation: EntranceInformation): Superposition<Identity, DataSourceError | IdentityError> {
    return this.accountQuery.findByEntranceInfo(entranceInformation).map<Identity, DataSourceError | LanguageError | NoSuchElementError | RegionError | VeauAccountError>((veauAccount: VeauAccount) => {
      // TODO SIMULTANEOUSLY
      return this.languageQuery.find(veauAccount.getLanguageID()).map<Identity, DataSourceError | LanguageError | NoSuchElementError | RegionError>((language: Language) => {
        return this.regionQuery.find(veauAccount.getRegionID()).map<Identity, DataSourceError | NoSuchElementError | RegionError>((region: Region) => {
          return Identity.of(veauAccount.getVeauAccountID(), veauAccount.getAccountName(), language, region);
        });
      });
    }).recover<Identity, DataSourceError | IdentityError>((err: DataSourceError | LanguageError | NoSuchElementError | RegionError | VeauAccountError) => {
      if (err instanceof DataSourceError) {
        throw err;
      }

      throw new IdentityError('IdentityBinQuery.find()', err);
    }, IdentityError, DataSourceError);
  }
}
