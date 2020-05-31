import 'reflect-metadata';

import sinon, { SinonSpy, SinonStub } from 'sinon';

import { AJAXError } from '@jamashita/publikum-ajax';
import { CacheError } from '@jamashita/publikum-cache';
import { DataSourceError } from '@jamashita/publikum-error';
import { Alive, Dead, Superposition } from '@jamashita/publikum-monad';

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
import { StatsListItemsError } from '../../../VO/StatsListItem/Error/StatsListItemsError';
import { StatsListItems } from '../../../VO/StatsListItem/StatsListItems';
import { StatsOutlinesError } from '../../../VO/StatsOutline/Error/StatsOutlinesError';
import { MockStatsOutline } from '../../../VO/StatsOutline/Mock/MockStatsOutline';
import { MockStatsOutlines } from '../../../VO/StatsOutline/Mock/MockStatsOutlines';
import { StatsOutlines } from '../../../VO/StatsOutline/StatsOutlines';
import { TermsError } from '../../../VO/Term/Error/TermsError';
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
      const statsListItemQuery1: StatsListItemQuery = vault.get<StatsListItemQuery>(Type.StatsListItemVaultQuery);
      const statsListItemQuery2: StatsListItemQuery = vault.get<StatsListItemQuery>(Type.StatsListItemVaultQuery);

      expect(statsListItemQuery1).toBeInstanceOf(StatsListItemQuery);
      expect(statsListItemQuery1).toBe(statsListItemQuery2);
    });
  });

  describe('findByVeauAccountID', () => {
    it('normal case', async () => {
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
      stub1.resolves(Alive.of<StatsOutlines, DataSourceError>(outlines));
      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.resolves(Alive.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.resolves(Alive.of<Terms, DataSourceError>(terms));

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const superposition: Superposition<
        StatsListItems,
        StatsListItemsError | DataSourceError
      > = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage());

      expect(superposition.isAlive()).toBe(true);
      const listItems: StatsListItems = superposition.get();

      expect(listItems.size()).toBe(outlines.size());
      expect(listItems.get(0).get().getOutline()).toBe(outline1);
      expect(listItems.get(0).get().getLanguage()).toBe(language1);
      expect(listItems.get(0).get().getRegion()).toBe(region1);
      expect(listItems.get(0).get().getTerm()).toBe(term1);
      expect(listItems.get(1).get().getOutline()).toBe(outline2);
      expect(listItems.get(1).get().getLanguage()).toBe(language2);
      expect(listItems.get(1).get().getRegion()).toBe(region2);
      expect(listItems.get(1).get().getTerm()).toBe(term2);
    });

    it('StatsOutlineQuery returns Dead.StatsOutlinesError', async () => {
      const locale: MockLocale = new MockLocale();
      const terms: MockTerms = new MockTerms();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.resolves(Dead.of<StatsOutlines, StatsOutlinesError>(new StatsOutlinesError('test failed')));
      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.resolves(Alive.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.resolves(Alive.of<Terms, DataSourceError>(terms));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const superposition: Superposition<
        StatsListItems,
        StatsListItemsError | DataSourceError
      > = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsListItemsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsListItemsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('StatsOutlineQuery returns Dead.AJAXError', async () => {
      const locale: MockLocale = new MockLocale();
      const terms: MockTerms = new MockTerms();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.resolves(Dead.of<StatsOutlines, AJAXError>(new AJAXError('test failed', 500)));
      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.resolves(Alive.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.resolves(Alive.of<Terms, DataSourceError>(terms));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const superposition: Superposition<
        StatsListItems,
        StatsListItemsError | DataSourceError
      > = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsListItemsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('LocaleQuery returns Dead.LocaleError', async () => {
      const outlines: MockStatsOutlines = new MockStatsOutlines();
      const terms: MockTerms = new MockTerms();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.resolves(Alive.of<StatsOutlines, DataSourceError>(outlines));
      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.resolves(Dead.of<Locale, LocaleError>(new LocaleError('test faield')));
      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.resolves(Alive.of<Terms, DataSourceError>(terms));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const superposition: Superposition<
        StatsListItems,
        StatsListItemsError | DataSourceError
      > = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsListItemsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsListItemsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('LocaleQuery returns Dead.AJAXError', async () => {
      const outlines: MockStatsOutlines = new MockStatsOutlines();
      const terms: MockTerms = new MockTerms();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.resolves(Alive.of<StatsOutlines, DataSourceError>(outlines));
      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.resolves(Dead.of<Locale, AJAXError>(new AJAXError('test faield', 500)));
      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.resolves(Alive.of<Terms, DataSourceError>(terms));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const superposition: Superposition<
        StatsListItems,
        StatsListItemsError | DataSourceError
      > = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsListItemsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(AJAXError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('TermQuery returns Dead.TermsError', async () => {
      const outlines: MockStatsOutlines = new MockStatsOutlines();
      const locale: MockLocale = new MockLocale();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.resolves(Alive.of<StatsOutlines, DataSourceError>(outlines));
      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.resolves(Alive.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.resolves(Dead.of<Terms, TermsError>(new TermsError('test failed')));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const superposition: Superposition<
        StatsListItems,
        StatsListItemsError | DataSourceError
      > = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsListItemsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsListItemsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('TermQuery returns Dead.CacheError', async () => {
      const outlines: MockStatsOutlines = new MockStatsOutlines();
      const locale: MockLocale = new MockLocale();

      const statsOutlineQuery: MockStatsOutlineQuery = new MockStatsOutlineQuery();
      const localeQuery: MockLocaleQuery = new MockLocaleQuery();
      const termQuery: MockTermQuery = new MockTermQuery();
      const stub1: SinonStub = sinon.stub();

      statsOutlineQuery.findByVeauAccountID = stub1;
      stub1.resolves(Alive.of<StatsOutlines, DataSourceError>(outlines));
      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.resolves(Alive.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.resolves(Dead.of<Terms, CacheError>(new CacheError('test failed')));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const superposition: Superposition<
        StatsListItems,
        StatsListItemsError | DataSourceError
      > = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsListItemsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(CacheError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead.StatsListItemsError because there is no such LanguageID', async () => {
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
      stub1.resolves(Alive.of<StatsOutlines, DataSourceError>(outlines));
      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.resolves(Alive.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.resolves(Alive.of<Terms, DataSourceError>(terms));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const superposition: Superposition<
        StatsListItems,
        StatsListItemsError | DataSourceError
      > = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsListItemsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsListItemsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead.StatsListItemsError because there is no such RegionID', async () => {
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
      stub1.resolves(Alive.of<StatsOutlines, DataSourceError>(outlines));
      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.resolves(Alive.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.resolves(Alive.of<Terms, DataSourceError>(terms));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const superposition: Superposition<
        StatsListItems,
        StatsListItemsError | DataSourceError
      > = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsListItemsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsListItemsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });

    it('returns Dead.StatsListItemsError because there is no such TermID', async () => {
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
      stub1.resolves(Alive.of<StatsOutlines, DataSourceError>(outlines));
      const stub2: SinonStub = sinon.stub();

      localeQuery.all = stub2;
      stub2.resolves(Alive.of<Locale, DataSourceError>(locale));
      const stub3: SinonStub = sinon.stub();

      termQuery.all = stub3;
      stub3.resolves(Alive.of<Terms, DataSourceError>(terms));

      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const statsListItemQuery: StatsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
      const superposition: Superposition<
        StatsListItems,
        StatsListItemsError | DataSourceError
      > = await statsListItemQuery.findByVeauAccountID(new MockVeauAccountID(), new MockPage());

      expect(superposition.isDead()).toBe(true);
      superposition.match<void>(
        () => {
          spy1();
        },
        (err: StatsListItemsError | DataSourceError) => {
          spy2();
          expect(err).toBeInstanceOf(StatsListItemsError);
        }
      );

      expect(spy1.called).toBe(false);
      expect(spy2.called).toBe(true);
    });
  });
});
