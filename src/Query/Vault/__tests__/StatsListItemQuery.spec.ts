import { DataSourceError } from '@jamashita/catacombe-datasource';
import { FetchError } from '@jamashita/catacombe-fetch';
import { HeapError } from '@jamashita/catacombe-heap';
import { Schrodinger, Superposition } from '@jamashita/genitore';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { MockLanguage } from '../../../domain/VO/Language/Mock/MockLanguage';
import { MockLanguageID } from '../../../domain/VO/Language/Mock/MockLanguageID';
import { LocaleError } from '../../../domain/VO/Locale/Error/LocaleError';
import { Locale } from '../../../domain/VO/Locale/Locale';
import { MockLocale } from '../../../domain/VO/Locale/Mock/MockLocale';
import { MockPage } from '../../../domain/VO/Page/Mock/MockPage';
import { MockRegion } from '../../../domain/VO/Region/Mock/MockRegion';
import { MockRegionID } from '../../../domain/VO/Region/Mock/MockRegionID';
import { StatsListItemError } from '../../../domain/VO/StatsListItem/Error/StatsListItemError';
import { StatsListItems } from '../../../domain/VO/StatsListItem/StatsListItems';
import { StatsOutlineError } from '../../../domain/VO/StatsOutline/Error/StatsOutlineError';
import { MockStatsOutline } from '../../../domain/VO/StatsOutline/Mock/MockStatsOutline';
import { MockStatsOutlines } from '../../../domain/VO/StatsOutline/Mock/MockStatsOutlines';
import { StatsOutlines } from '../../../domain/VO/StatsOutline/StatsOutlines';
import { TermError } from '../../../domain/VO/Term/Error/TermError';
import { Term } from '../../../domain/VO/Term/Term';
import { Terms } from '../../../domain/VO/Term/Terms';
import { MockVeauAccountID } from '../../../domain/VO/VeauAccount/Mock/MockVeauAccountID';
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { MockStatsOutlineQuery } from '../../Mock/MockStatsOutlineQuery';
import { MockTermQuery } from '../../Mock/MockTermQuery';
import { StatsListItemQuery } from '../StatsListItemQuery';

describe('StatsListItemQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const statsListItemQuery1: StatsListItemQuery = vault.get<StatsListItemQuery>(Type.StatsListItemVaultQuery);
      const statsListItemQuery2: StatsListItemQuery = vault.get<StatsListItemQuery>(Type.StatsListItemVaultQuery);

      expect(statsListItemQuery1).toBeInstanceOf(StatsListItemQuery);
      expect(statsListItemQuery1).toBe(statsListItemQuery2);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
      expect.assertions(10);

      const languageID1: MockLanguageID = new MockLanguageID();
      const language1: MockLanguage = new MockLanguage({
        languageID: languageID1
      });
      const languageID2: MockLanguageID = new MockLanguageID();
      const language2: MockLanguage = new MockLanguage({
        languageID: languageID2
      });
      const regionID1: MockRegionID = new MockRegionID();
      const region1: MockRegion = new MockRegion({
        regionID: regionID1
      });
      const regionID2: MockRegionID = new MockRegionID();
      const region2: MockRegion = new MockRegion({
        regionID: regionID2
      });
      const term1: Term = Term.DAILY;
      const term2: Term = Term.WEEKLY;
      const outline1: MockStatsOutline = new MockStatsOutline({
        languageID: languageID1,
        regionID: regionID1,
        termID: term1.getTermID()
      });
      const outline2: MockStatsOutline = new MockStatsOutline({
        languageID: languageID2,
        regionID: regionID2,
        termID: term2.getTermID()
      });
      const outlines: MockStatsOutlines = new MockStatsOutlines(outline1, outline2);
      const locale: MockLocale = new MockLocale({
        languages: [language1, language2, new MockLanguage()],
        regions: [region1, region2, new MockRegion()]
      });
      const terms: Terms = Terms.all();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.returns(Superposition.alive<StatsOutlines, DataSourceError>(outlines, DataSourceError));

      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.returns(Superposition.alive<Terms, DataSourceError>(terms, DataSourceError));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const schrodinger: Schrodinger<StatsListItems, DataSourceError | StatsListItemError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isAlive()).toBe(true);
      const listItems: StatsListItems = schrodinger.get();

      expect(listItems.size()).toBe(outlines.size());
      expect(listItems.get(0)?.getOutline()).toBe(outline1);
      expect(listItems.get(0)?.getLanguage()).toBe(language1);
      expect(listItems.get(0)?.getRegion()).toBe(region1);
      expect(listItems.get(0)?.getTerm()).toBe(term1);
      expect(listItems.get(1)?.getOutline()).toBe(outline2);
      expect(listItems.get(1)?.getLanguage()).toBe(language2);
      expect(listItems.get(1)?.getRegion()).toBe(region2);
      expect(listItems.get(1)?.getTerm()).toBe(term2);
    });

    it('statsOutlineQuery returns Dead.StatsOutlineError', async () => {
      expect.assertions(2);

      const locale: MockLocale = new MockLocale();
      const terms: Terms = Terms.all();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.returns(Superposition.dead<StatsOutlines, StatsOutlineError>(new StatsOutlineError('test failed'), StatsOutlineError));

      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.returns(Superposition.alive<Terms, DataSourceError>(terms, DataSourceError));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const schrodinger: Schrodinger<StatsListItems, DataSourceError | StatsListItemError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsListItemError);
    });

    it('statsOutlineQuery returns Dead.FetchError', async () => {
      expect.assertions(2);

      const locale: MockLocale = new MockLocale();
      const terms: Terms = Terms.all();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.returns(Superposition.dead<StatsOutlines, FetchError>(new FetchError('test failed'), FetchError));

      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.returns(Superposition.alive<Terms, DataSourceError>(terms, DataSourceError));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const schrodinger: Schrodinger<StatsListItems, DataSourceError | StatsListItemError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('localeQuery returns Dead.LocaleError', async () => {
      expect.assertions(2);

      const outlines: MockStatsOutlines = new MockStatsOutlines();
      const terms: Terms = Terms.all();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.returns(Superposition.alive<StatsOutlines, DataSourceError>(outlines, DataSourceError));

      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.returns(Superposition.dead<Locale, LocaleError>(new LocaleError('test faield'), LocaleError));

      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;

      stub3.returns(Superposition.alive<Terms, DataSourceError>(terms, DataSourceError));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const schrodinger: Schrodinger<StatsListItems, DataSourceError | StatsListItemError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsListItemError);
    });

    it('localeQuery returns Dead.FetchError', async () => {
      expect.assertions(2);

      const outlines: MockStatsOutlines = new MockStatsOutlines();
      const terms: Terms = Terms.all();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.returns(Superposition.alive<StatsOutlines, DataSourceError>(outlines, DataSourceError));

      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.returns(Superposition.dead<Locale, FetchError>(new FetchError('test faield'), FetchError));

      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.returns(Superposition.alive<Terms, DataSourceError>(terms, DataSourceError));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const schrodinger: Schrodinger<StatsListItems, DataSourceError | StatsListItemError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FetchError);
    });

    it('termQuery returns Dead.TermError', async () => {
      expect.assertions(2);

      const outlines: MockStatsOutlines = new MockStatsOutlines();
      const locale: MockLocale = new MockLocale();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.returns(Superposition.alive<StatsOutlines, DataSourceError>(outlines, DataSourceError));

      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.returns(Superposition.dead<Terms, TermError>(new TermError('test failed'), TermError));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const schrodinger: Schrodinger<StatsListItems, DataSourceError | StatsListItemError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsListItemError);
    });

    it('termQuery returns Dead.HeapError', async () => {
      expect.assertions(2);

      const outlines: MockStatsOutlines = new MockStatsOutlines();
      const locale: MockLocale = new MockLocale();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.returns(Superposition.alive<StatsOutlines, DataSourceError>(outlines, DataSourceError));

      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.returns(Superposition.dead<Terms, HeapError>(new HeapError('test failed'), HeapError));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const schrodinger: Schrodinger<StatsListItems, DataSourceError | StatsListItemError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(HeapError);
    });

    it('returns Dead.StatsListItemError because there is no such LanguageID', async () => {
      expect.assertions(2);

      const languageID1: MockLanguageID = new MockLanguageID();
      const language1: MockLanguage = new MockLanguage({
        languageID: languageID1
      });
      const languageID2: MockLanguageID = new MockLanguageID();
      const outline: MockStatsOutline = new MockStatsOutline({
        languageID: languageID2
      });
      const outlines: MockStatsOutlines = new MockStatsOutlines(outline);
      const locale: MockLocale = new MockLocale({
        languages: [language1]
      });
      const terms: Terms = Terms.all();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.returns(Superposition.alive<StatsOutlines, DataSourceError>(outlines, DataSourceError));

      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.returns(Superposition.alive<Terms, DataSourceError>(terms, DataSourceError));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const schrodinger: Schrodinger<StatsListItems, DataSourceError | StatsListItemError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsListItemError);
    });

    it('returns Dead.StatsListItemError because there is no such RegionID', async () => {
      expect.assertions(2);

      const languageID1: MockLanguageID = new MockLanguageID();
      const language1: MockLanguage = new MockLanguage({
        languageID: languageID1
      });
      const regionID1: MockRegionID = new MockRegionID();
      const region1: MockRegion = new MockRegion({
        regionID: regionID1
      });
      const regionID2: MockRegionID = new MockRegionID();
      const outline: MockStatsOutline = new MockStatsOutline({
        languageID: languageID1,
        regionID: regionID2
      });
      const outlines: MockStatsOutlines = new MockStatsOutlines(outline);
      const locale: MockLocale = new MockLocale({
        languages: [language1],
        regions: [region1]
      });
      const terms: Terms = Terms.all();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.returns(Superposition.alive<StatsOutlines, DataSourceError>(outlines, DataSourceError));

      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.returns(Superposition.alive<Terms, DataSourceError>(terms, DataSourceError));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const schrodinger: Schrodinger<StatsListItems, DataSourceError | StatsListItemError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsListItemError);
    });
  });
});
