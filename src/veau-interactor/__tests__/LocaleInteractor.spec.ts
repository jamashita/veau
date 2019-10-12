import 'jest';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { LanguageCommand } from '../../veau-command/LanguageCommand';
import { RegionCommand } from '../../veau-command/RegionCommand';
import { LanguageQuery } from '../../veau-query/LanguageQuery';
import { RegionQuery } from '../../veau-query/RegionQuery';
import { Locale } from '../../veau-vo/aggregate/Locale';
import { Languages } from '../../veau-vo/collection/Languages';
import { Regions } from '../../veau-vo/collection/Regions';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { LocaleInteractor } from '../LocaleInteractor';

describe('LocaleInteractor',  () => {
  describe('all', () => {
    it('normal case', async () => {
      const stub1: SinonStub = sinon.stub();
      LanguageQuery.prototype.all = stub1;
      stub1.resolves(Languages.of([
        Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
        Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
      ]));
      const stub2: SinonStub = sinon.stub();
      RegionQuery.prototype.all = stub2;
      stub2.resolves(Regions.of([
        Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
        Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
      ]));

      const localeInteractor: LocaleInteractor = LocaleInteractor.getInstance();
      const locale: Locale = await localeInteractor.all();

      expect(locale.getLanguage(0).getLanguageID().get()).toEqual(1);
      expect(locale.getLanguage(0).getName().get()).toEqual('аҧсуа бызшәа');
      expect(locale.getLanguage(0).getEnglishName().get()).toEqual('Abkhazian');
      expect(locale.getLanguage(0).getISO639().get()).toEqual('ab');
      expect(locale.getLanguage(1).getLanguageID().get()).toEqual(2);
      expect(locale.getLanguage(1).getName().get()).toEqual('Afaraf');
      expect(locale.getLanguage(1).getEnglishName().get()).toEqual('Afar');
      expect(locale.getLanguage(1).getISO639().get()).toEqual('aa');
      expect(locale.getRegion(0).getRegionID().get()).toEqual(1);
      expect(locale.getRegion(0).getName().get()).toEqual('Afghanistan');
      expect(locale.getRegion(0).getISO3166().get()).toEqual('AFG');
      expect(locale.getRegion(1).getRegionID().get()).toEqual(2);
      expect(locale.getRegion(1).getName().get()).toEqual('Albania');
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
