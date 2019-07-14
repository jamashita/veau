import 'jest';
import * as sinon from 'sinon';
import { SinonSpy, SinonStub } from 'sinon';
import { LanguageCommand } from '../../veau-command/LanguageCommand';
import { RegionCommand } from '../../veau-command/RegionCommand';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { LanguageQuery } from '../../veau-query/LanguageQuery';
import { RegionQuery } from '../../veau-query/RegionQuery';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { RegionID } from '../../veau-vo/RegionID';
import { LocaleInteractor, Locales } from '../LocaleInteractor';

describe('LocaleInteractor',  () => {
  describe('all', () => {
    it('normal case', async () => {
      const stub1: SinonStub = sinon.stub();
      LanguageQuery.prototype.all = stub1;
      stub1.resolves([
        Language.from(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab')),
        Language.from(LanguageID.of(2), 'Afaraf', 'Afar', ISO639.of('aa'))
      ]);
      const stub2: SinonStub = sinon.stub();
      RegionQuery.prototype.all = stub2;
      stub2.resolves([
        new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG')),
        new Region(RegionID.of(2), 'Albania', ISO3166.of('ALB'))
      ]);

      const localelocaleInteractor: LocaleInteractor = LocaleInteractor.getInstance();
      const locales: Locales = await localelocaleInteractor.all();

      expect(locales.languages.length).toEqual(2);
      expect(locales.languages[0].getLanguageID().get()).toEqual(1);
      expect(locales.languages[0].getName()).toEqual('аҧсуа бызшәа');
      expect(locales.languages[0].getEnglishName()).toEqual('Abkhazian');
      expect(locales.languages[0].getISO639().get()).toEqual('ab');
      expect(locales.languages[1].getLanguageID().get()).toEqual(2);
      expect(locales.languages[1].getName()).toEqual('Afaraf');
      expect(locales.languages[1].getEnglishName()).toEqual('Afar');
      expect(locales.languages[1].getISO639().get()).toEqual('aa');
      expect(locales.regions.length).toEqual(2);
      expect(locales.regions[0].getRegionID().get()).toEqual(1);
      expect(locales.regions[0].getName()).toEqual('Afghanistan');
      expect(locales.regions[0].getISO3166().get()).toEqual('AFG');
      expect(locales.regions[1].getRegionID().get()).toEqual(2);
      expect(locales.regions[1].getName()).toEqual('Albania');
      expect(locales.regions[1].getISO3166().get()).toEqual('ALB');
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
