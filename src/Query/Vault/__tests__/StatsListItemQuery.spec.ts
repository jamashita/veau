import 'reflect-metadata';

import { Alive, DataSourceError, Superposition } from 'publikum';
import sinon, { SinonStub } from 'sinon';

import { Type } from '../../../Container/Types';
import { vault } from '../../../Container/Vault';
import { MockLanguage } from '../../../VO/Language/Mock/MockLanguage';
import { MockLanguageID } from '../../../VO/Language/Mock/MockLanguageID';
import { Locale } from '../../../VO/Locale/Locale';
import { MockLocale } from '../../../VO/Locale/Mock/MockLocale';
import { MockPage } from '../../../VO/Page/Mock/MockPage';
import { MockRegion } from '../../../VO/Region/Mock/MockRegion';
import { MockRegionID } from '../../../VO/Region/Mock/MockRegionID';
import { StatsListItemsError } from '../../../VO/StatsListItem/Error/StatsListItemsError';
import { StatsListItems } from '../../../VO/StatsListItem/StatsListItems';
import { MockStatsOutline } from '../../../VO/StatsOutline/Mock/MockStatsOutline';
import { MockStatsOutlines } from '../../../VO/StatsOutline/Mock/MockStatsOutlines';
import { StatsOutlines } from '../../../VO/StatsOutline/StatsOutlines';
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

      const statsListItemQuery = new StatsListItemQuery(statsOutlineQuery, localeQuery, termQuery);
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
  });
});
