import { IIdentityQuery } from '../Interface/IIdentityQuery';
import { injectable, inject } from 'inversify';
import { IVaultQuery } from '../Interface/IVaultQuery';
import { VeauAccountQuery } from '../AJAX/VeauAccountQuery';
import { TYPE } from '../../Container/Types';
import { LanguageQuery } from './LanguageQuery';
import { IVeauAccountQuery } from '../Interface/IVeauAccountQuery';
import { ILanguageQuery } from '../Interface/ILanguageQuery';
import { RegionQuery } from './RegionQuery';
import { IRegionQuery } from '../Interface/IRegionQuery';
import { EntranceInformation } from 'src/VO/EntranceInformation';
import { Superposition, DataSourceError, Dead, Alive } from 'publikum';
import { Identity } from 'src/VO/Identity';
import { IdentityError } from 'src/Error/IdentityError';
import { VeauAccount } from '../../VO/VeauAccount';
import { VeauAccountError } from 'src/Error/VeauAccountError';
import { Language } from '../../VO/Language';
import { LanguageError } from '../../Error/LanguageError';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { Region } from '../../VO/Region';
import { RegionError } from '../../Error/RegionError';

@injectable()
export class IdentityQuery implements IIdentityQuery, IVaultQuery {
  public readonly noun: 'IdentityQuery' = 'IdentityQuery';
  public readonly source: 'Vault' = 'Vault';
  private readonly veauAccountQuery: IVeauAccountQuery;
  private readonly languageQuery: ILanguageQuery;
  private readonly regionQuery: IRegionQuery

  public constructor(
    @inject(TYPE.VeauAccountAJAXQuery) veauAccountQuery: IVeauAccountQuery,
    @inject(TYPE.LanguageVaultQuery) languageQuery: ILanguageQuery
    @inject(TYPE.RegionVaultQuery) regionQuery: IRegionQuery
  ) {
    this.veauAccountQuery = veauAccountQuery;
    this.languageQuery = languageQuery;
    this.regionQuery = regionQuery;
  }

  public async find(): Promise<Superposition<Identity, IdentityError | DataSourceError>> {
    const superposition1: Superposition<VeauAccount, VeauAccountError | DataSourceError> = await this.veauAccountQuery.find();

    return superposition1.match<Superposition<Identity, IdentityError | DataSourceError>>(async (veauAccount: VeauAccount) => {
      const [
        superposition2,
        superposition3
      ]: [
        Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>,
        Superposition<Region, RegionError | NoSuchElementError | DataSourceError>
      ] = await Promise.all([
        this.languageQuery.find(veauAccount.getLanguageID()),
        this.regionQuery.find(veauAccount.getRegionID())
      ])

      return superposition2.match<Superposition<Identity, IdentityError | DataSourceError>>((language: Language) => {
        return superposition3.match<Superposition<Identity, IdentityError | DataSourceError>>((region: Region) => {
          return Alive.of<Identity, DataSourceError>(
            Identity.of(
              veauAccount.getVeauAccountID(),
              veauAccount.getAccountName(),
              language,
              region
            )
          );
        }, (err: RegionError | NoSuchElementError | DataSourceError) => {
          if (err instanceof DataSourceError) {
            return Dead.of<Identity, DataSourceError>(err);
          }

          return Dead.of<Identity, IdentityError>(new IdentityError('IdentityQuery.find()', err));
        });
      }, (err: LanguageError | NoSuchElementError | DataSourceError) => {
        if (err instanceof DataSourceError) {
          return Dead.of<Identity, DataSourceError>(err);
        }

        return Dead.of<Identity, IdentityError>(new IdentityError('IdentityQuery.find()', err));
      });
    }, (err: VeauAccountError | DataSourceError) => {
      if (err instanceof VeauAccountError) {
        return Promise.resolve<Superposition<Identity, IdentityError>>(Dead.of<Identity, IdentityError>(new IdentityError('IdentityQuery.find()', err)));
      }

      return Promise.resolve<Superposition<Identity, DataSourceError>>(Dead.of<Identity, DataSourceError>(err));
    });
  }

  public async findByEntranceInfo(entranceInformation: EntranceInformation): Promise<Superposition<Identity, IdentityError | DataSourceError>> {
    const superposition1: Superposition<VeauAccount, VeauAccountError | DataSourceError> = await this.veauAccountQuery.findByEntranceInfo(entranceInformation);

    return superposition1.match<Superposition<Identity, IdentityError | DataSourceError>>(async (veauAccount: VeauAccount) => {
      const [
        superposition2,
        superposition3
      ]: [
          Superposition<Language, LanguageError | NoSuchElementError | DataSourceError>,
          Superposition<Region, RegionError | NoSuchElementError | DataSourceError>
        ] = await Promise.all([
          this.languageQuery.find(veauAccount.getLanguageID()),
          this.regionQuery.find(veauAccount.getRegionID())
        ])

      return superposition2.match<Superposition<Identity, IdentityError | DataSourceError>>((language: Language) => {
        return superposition3.match<Superposition<Identity, IdentityError | DataSourceError>>((region: Region) => {
          return Alive.of<Identity, DataSourceError>(
            Identity.of(
              veauAccount.getVeauAccountID(),
              veauAccount.getAccountName(),
              language,
              region
            )
          );
        }, (err: RegionError | NoSuchElementError | DataSourceError) => {
          if (err instanceof DataSourceError) {
            return Dead.of<Identity, DataSourceError>(err);
          }

          return Dead.of<Identity, IdentityError>(new IdentityError('IdentityQuery.find()', err));
        });
      }, (err: LanguageError | NoSuchElementError | DataSourceError) => {
        if (err instanceof DataSourceError) {
          return Dead.of<Identity, DataSourceError>(err);
        }

        return Dead.of<Identity, IdentityError>(new IdentityError('IdentityQuery.find()', err));
      });
    }, (err: VeauAccountError | DataSourceError) => {
      if (err instanceof VeauAccountError) {
        return Promise.resolve<Superposition<Identity, IdentityError>>(Dead.of<Identity, IdentityError>(new IdentityError('IdentityQuery.find()', err)));
      }

      return Promise.resolve<Superposition<Identity, DataSourceError>>(Dead.of<Identity, DataSourceError>(err));
    });
  }
}