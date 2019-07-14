import 'jest';
import * as sinon from 'sinon';
import { SinonSpy, SinonStub } from 'sinon';
import { LanguageCommand } from '../../veau-command/LanguageCommand';
import { RegionCommand } from '../../veau-command/RegionCommand';
import { Locale } from '../../veau-entity/aggregate/Locale';
import { Languages } from '../../veau-entity/collection/Languages';
import { Regions } from '../../veau-entity/collection/Regions';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { LanguageQuery } from '../../veau-query/LanguageQuery';
import { RegionQuery } from '../../veau-query/RegionQuery';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { RegionID } from '../../veau-vo/RegionID';
import { LocaleInteractor } from '../LocaleInteractor';

describe('LocaleInteractor',  () => {
  describe('all', () => {
    it('normal case', async () => {
      const stub1: SinonStub = sinon.stub();
      LanguageQuery.prototype.all = stub1;
      stub1.resolves(Languages.from([
        Language.from(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab')),
        Language.from(LanguageID.of(2), 'Afaraf', 'Afar', ISO639.of('aa'))
      ]));
      const stub2: SinonStub = sinon.stub();
      RegionQuery.prototype.all = stub2;
      stub2.resolves(Regions.from([
        Region.from(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG')),
        Region.from(RegionID.of(2), 'Albania', ISO3166.of('ALB'))
      ]));

      const localeInteractor: LocaleInteractor = LocaleInteractor.getInstance();
      const locale: Locale = await localeInteractor.all();

      expect(locale.getLanguage(0).getLanguageID().get()).toEqual(1);
      expect(locale.getLanguage(0).getName()).toEqual('аҧсуа бызшәа');
      expect(locale.getLanguage(0).getEnglishName()).toEqual('Abkhazian');
      expect(locale.getLanguage(0).getISO639().get()).toEqual('ab');
      expect(locale.getLanguage(1).getLanguageID().get()).toEqual(2);
      expect(locale.getLanguage(1).getName()).toEqual('Afaraf');
      expect(locale.getLanguage(1).getEnglishName()).toEqual('Afar');
      expect(locale.getLanguage(1).getISO639().get()).toEqual('aa');
      expect(locale.getRegion(0).getRegionID().get()).toEqual(1);
      expect(locale.getRegion(0).getName()).toEqual('Afghanistan');
      expect(locale.getRegion(0).getISO3166().get()).toEqual('AFG');
      expect(locale.getRegion(1).getRegionID().get()).toEqual(2);
      expect(locale.getRegion(1).getName()).toEqual('Albania');
      expect(locale.getRegion(1).getISO3166().get()).toEqual('ALB');
    });
  });

  describe('delete', () => {
    it('normal case', async () => {
      const spy1: SinonSpy = sinon.spy();
      LanguageCommand.prototype.deleteAll = spy1;
      const spy2: SinonSpy = sinon.spy();
      RegionCommand.prototype.deleteAll = spy2;

      const localeInteractor: LocaleInteractor = LocaleInteractor.getInstance();
      await localeInteractor.delete();

      expect(spy1.called).toEqual(true);
      expect(spy2.called).toEqual(true);
    });
  });
});
