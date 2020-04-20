import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { TYPE } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { AJAXError } from '../../../General/AJAX/AJAXError';
import { DataSourceError } from '../../../General/DataSourceError';
import { Failure } from '../../../General/Superposition/Failure';
import { Success } from '../../../General/Superposition/Success';
import { Superposition } from '../../../General/Superposition/Superposition';
import { ISO3166 } from '../../../VO/ISO3166';
import { Locale } from '../../../VO/Locale';
import { MockISO3166 } from '../../../VO/Mock/MockISO3166';
import { MockLocale } from '../../../VO/Mock/MockLocale';
import { MockRegion } from '../../../VO/Mock/MockRegion';
import { MockRegions } from '../../../VO/Mock/MockRegions';
import { Region } from '../../../VO/Region';
import { Regions } from '../../../VO/Regions';
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const regionQuery1: RegionQuery = vault.get<RegionQuery>(TYPE.RegionVaultQuery);
      const regionQuery2: RegionQuery = vault.get<RegionQuery>(TYPE.RegionVaultQuery);

      expect(regionQuery1).toBeInstanceOf(RegionQuery);
      expect(regionQuery1).toBe(regionQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const locale: MockLocale = new MockLocale();

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Success.of<Locale, DataSourceError>(locale));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const superposition: Superposition<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(superposition.isSuccess()).toBe(true);
      expect(superposition.get()).toBe(locale.getRegions());
    });

    it('LocaleQuery returns Failure', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Failure.of<Locale, DataSourceError>(new AJAXError('test failed', 500)));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const superposition: Superposition<Regions, NoSuchElementError | DataSourceError> = await regionQuery.all();

      expect(superposition.isFailure()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      const locale: MockLocale = new MockLocale({
        regions: new MockRegions(
          new MockRegion({
            iso3166: new MockISO3166('AFG')
          }),
          new MockRegion({
            iso3166: new MockISO3166('ALB')
          })
        )
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Success.of<Locale, DataSourceError>(locale));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const superposition: Superposition<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(superposition.isSuccess()).toBe(true);
      expect(superposition.get()).toBe(locale.getRegions().get(1).get());
    });

    it('LocaleQuery.all returns Failure', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Failure.of<Locale, DataSourceError>(new AJAXError('test failed', 100)));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const superposition: Superposition<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(superposition.isFailure()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(AJAXError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('no match results', async () => {
      const locale: MockLocale = new MockLocale({
        regions: new MockRegions(
          new MockRegion({
            iso3166: new MockISO3166('AFG')
          }),
          new MockRegion({
            iso3166: new MockISO3166('ALB')
          })
        )
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Success.of<Locale, DataSourceError>(locale));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const superposition: Superposition<Region, NoSuchElementError | DataSourceError> = await regionQuery.findByISO3166(ISO3166.of('OOP'));

      expect(superposition.isFailure()).toBe(true);
      superposition.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
