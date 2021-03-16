import { AJAXError } from '@jamashita/publikum-ajax';
import { CacheError } from '@jamashita/publikum-cache';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Language/Mock/MockLanguageID';
import { LocaleError } from '../../../VO/Locale/Error/LocaleError';
import { Locale } from '../../../VO/Locale/Locale';
import { MockLocale } from '../../../VO/Locale/Mock/MockLocale';
import { MockPage } from '../../../VO/Page/Mock/MockPage';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Region/Mock/MockRegionID';
import { StatsListItemError } from '../../../VO/StatsListItem/Error/StatsListItemError';
import { StatsListItems } from '../../../VO/StatsListItem/StatsListItems';
import { StatsOutlineError } from '../../../VO/StatsOutline/Error/StatsOutlineError';
import { MockStatsOutline } from '../../../VO/StatsOutline/Mock/MockStatsOutline';
import { MockStatsOutlines } from '../../../VO/StatsOutline/Mock/MockStatsOutlines';
import { StatsOutlines } from '../../../VO/StatsOutline/StatsOutlines';
import { TermError } from '../../../VO/Term/Error/TermError';
import { MockTerm } from '../../../VO/Term/Mock/MockTerm';
import { MockTermID } from '../../../VO/Term/Mock/MockTermID';
import { MockTerms } from '../../../VO/Term/Mock/MockTerms';
import { Terms } from '../../../VO/Term/Terms';
import { MockVeauAccountID } from '../../../VO/VeauAccount/Mock/MockVeauAccountID';
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
      const termID1: MockTermID = new MockTermID();
      const term1: MockTerm = new MockTerm({
        termID: termID1
      });
      const termID2: MockTermID = new MockTermID();
      const term2: MockTerm = new MockTerm({
        termID: termID2
      });
      const outline1: MockStatsOutline = new MockStatsOutline({
        languageID: languageID1,
        regionID: regionID1,
        termID: termID1
      });
      const outline2: MockStatsOutline = new MockStatsOutline({
        languageID: languageID2,
        regionID: regionID2,
        termID: termID2
      });
      const outlines: MockStatsOutlines = new MockStatsOutlines(outline1, outline2);
      const locale: MockLocale = new MockLocale({
        languages: [language1, language2, new MockLanguage()],
        regions: [region1, region2, new MockRegion()]
      });
      const terms: MockTerms = new MockTerms(term1, term2);

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
      const schrodinger: Schrodinger<StatsListItems, StatsListItemError | DataSourceError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

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
      const terms: MockTerms = new MockTerms();

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
      const schrodinger: Schrodinger<StatsListItems, StatsListItemError | DataSourceError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsListItemError);
    });

    it('statsOutlineQuery returns Dead.AJAXError', async () => {
      expect.assertions(2);

      const locale: MockLocale = new MockLocale();
      const terms: MockTerms = new MockTerms();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.returns(Superposition.dead<StatsOutlines, AJAXError>(new AJAXError('test failed', 500), AJAXError));

      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.returns(Superposition.alive<Locale, DataSourceError>(locale, DataSourceError));

      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.returns(Superposition.alive<Terms, DataSourceError>(terms, DataSourceError));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const schrodinger: Schrodinger<StatsListItems, StatsListItemError | DataSourceError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AJAXError);
    });

    it('localeQuery returns Dead.LocaleError', async () => {
      expect.assertions(2);

      const outlines: MockStatsOutlines = new MockStatsOutlines();
      const terms: MockTerms = new MockTerms();

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
      const schrodinger: Schrodinger<StatsListItems, StatsListItemError | DataSourceError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsListItemError);
    });

    it('localeQuery returns Dead.AJAXError', async () => {
      expect.assertions(2);

      const outlines: MockStatsOutlines = new MockStatsOutlines();
      const terms: MockTerms = new MockTerms();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.returns(Superposition.alive<StatsOutlines, DataSourceError>(outlines, DataSourceError));

      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.returns(Superposition.dead<Locale, AJAXError>(new AJAXError('test faield', 500), AJAXError));

      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.returns(Superposition.alive<Terms, DataSourceError>(terms, DataSourceError));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const schrodinger: Schrodinger<StatsListItems, StatsListItemError | DataSourceError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(AJAXError);
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
      const schrodinger: Schrodinger<StatsListItems, StatsListItemError | DataSourceError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsListItemError);
    });

    it('termQuery returns Dead.CacheError', async () => {
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
      stub3.returns(Superposition.dead<Terms, CacheError>(new CacheError('test failed'), CacheError));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const schrodinger: Schrodinger<StatsListItems, StatsListItemError | DataSourceError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(CacheError);
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
      const terms: MockTerms = new MockTerms();

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
      const schrodinger: Schrodinger<StatsListItems, StatsListItemError | DataSourceError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

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
      const terms: MockTerms = new MockTerms();

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
      const schrodinger: Schrodinger<StatsListItems, StatsListItemError | DataSourceError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsListItemError);
    });

    it('returns Dead.StatsListItemError because there is no such TermID', async () => {
      expect.assertions(2);

      const languageID1: MockLanguageID = new MockLanguageID();
      const language1: MockLanguage = new MockLanguage({
        languageID: languageID1
      });
      const regionID1: MockRegionID = new MockRegionID();
      const region1: MockRegion = new MockRegion({
        regionID: regionID1
      });
      const termID1: MockTermID = new MockTermID();
      const term1: MockTerm = new MockTerm({
        termID: termID1
      });
      const termID2: MockTermID = new MockTermID();
      const outline: MockStatsOutline = new MockStatsOutline({
        languageID: languageID1,
        regionID: regionID1,
        termID: termID2
      });
      const outlines: MockStatsOutlines = new MockStatsOutlines(outline);
      const locale: MockLocale = new MockLocale({
        languages: [language1],
        regions: [region1]
      });
      const terms: MockTerms = new MockTerms(term1);

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
      const schrodinger: Schrodinger<StatsListItems, StatsListItemError | DataSourceError> = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage()).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(StatsListItemError);
    });
  });
});
