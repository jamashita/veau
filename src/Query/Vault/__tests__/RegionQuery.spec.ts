import 'reflect-metadata';

import { AJAXError, Alive, DataSourceError, Dead, Superposition } from 'publikum';
import sinon, { SinonSpy, SinonStub } from 'sinon';

import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { Locale } from '../../../VO/Locale/Locale';
import { MockLocale } from '../../../VO/Locale/Mock/MockLocale';
import { RegionError } from '../../../VO/Region/Error/RegionError';
import { RegionsError } from '../../../VO/Region/Error/RegionsError';
import { ISO3166 } from '../../../VO/Region/ISO3166';
import { MockISO3166 } from '../../../VO/Region/Mock/MockISO3166';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { Region } from '../../../VO/Region/Region';
import { Regions } from '../../../VO/Region/Regions';
import { NoSuchElementError } from '../../Error/NoSuchElementError';
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { RegionQuery } from '../RegionQuery';

describe('RegionQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const regionQuery1: RegionQuery = vault.get<RegionQuery>(Type.RegionVaultQuery);
      const regionQuery2: RegionQuery = vault.get<RegionQuery>(Type.RegionVaultQuery);

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
      stub.resolves(Alive.of<Locale, DataSourceError>(locale));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const superposition: Superposition<Regions, RegionsError | DataSourceError> = await regionQuery.all();

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(locale.getRegions());
    });

    it('LocaleQuery returns Dead', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.resolves(Dead.of<Locale, DataSourceError>(new AJAXError('test failed', 500)));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const superposition: Superposition<Regions, RegionsError | DataSourceError> = await regionQuery.all();

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: RegionsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });

  describe('findByISO3166', () => {
    it('normal case', async () => {
      const region1: MockRegion = new MockRegion({
        iso3166: new MockISO3166('AFG')
      });
      const region2: MockRegion = new MockRegion({
        iso3166: new MockISO3166('ALB')
      });
      const locale: MockLocale = new MockLocale({
        regions: [region1, region2]
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.resolves(Alive.of<Locale, DataSourceError>(locale));

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const superposition: Superposition<
        Region,
        RegionError | NoSuchElementError | DataSourceError
      > = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(superposition.isAlive()).toBe(true);
      expect(superposition.get()).toBe(locale.getRegions().get(region2.getRegionID()).get());
    });

    it('LocaleQuery.all returns Dead, AJAXError', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.resolves(Dead.of<Locale, DataSourceError>(new AJAXError('test failed', 100)));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const superposition: Superposition<
        Region,
        RegionError | NoSuchElementError | DataSourceError
      > = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: RegionError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('LocaleQuery.all returns Dead, RegionError', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.resolves(Dead.of<Locale, RegionsError>(new RegionsError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const superposition: Superposition<
        Region,
        RegionError | NoSuchElementError | DataSourceError
      > = await regionQuery.findByISO3166(ISO3166.of('ALB'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: RegionError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(RegionError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('no match results', async () => {
      const locale: MockLocale = new MockLocale({
        regions: [
          new MockRegion({
            iso3166: new MockISO3166('AFG')
          }),
          new MockRegion({
            iso3166: new MockISO3166('ALB')
          })
        ]
      });

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();

      localeVaultQuery.all = stub;
      stub.resolves(Alive.of<Locale, DataSourceError>(locale));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const regionQuery: RegionQuery = new RegionQuery(localeVaultQuery);
      const superposition: Superposition<
        Region,
        RegionError | NoSuchElementError | DataSourceError
      > = await regionQuery.findByISO3166(ISO3166.of('OOP'));

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: RegionError | NoSuchElementError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(NoSuchElementError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
