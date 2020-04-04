import 'jest';
import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { LanguageCommand } from '../../veau-command/LanguageCommand';
import { RegionCommand } from '../../veau-command/RegionCommand';
import { container } from '../../veau-container/Container';
import { TYPE } from '../../veau-container/Types';
import { CacheError } from '../../veau-error/CacheError';
import { Failure } from '../../veau-general/Try/Failure';
import { Success } from '../../veau-general/Try/Success';
import { Try } from '../../veau-general/Try/Try';
import { LanguageQuery } from '../../veau-query/LanguageQuery';
import { RegionQuery } from '../../veau-query/RegionQuery';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageID } from '../../veau-vo/LanguageID';
import { LanguageName } from '../../veau-vo/LanguageName';
import { Languages } from '../../veau-vo/Languages';
import { Locale } from '../../veau-vo/Locale';
import { Region } from '../../veau-vo/Region';
import { RegionID } from '../../veau-vo/RegionID';
import { RegionName } from '../../veau-vo/RegionName';
import { Regions } from '../../veau-vo/Regions';
import { LocaleInteractor } from '../LocaleInteractor';

describe('LocaleInteractor',  () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const localeInteractor1: LocaleInteractor = container.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const localeInteractor2: LocaleInteractor = container.get<LocaleInteractor>(TYPE.LocaleInteractor);

      expect(localeInteractor1).toBeInstanceOf(LocaleInteractor);
      expect(localeInteractor1).toBe(localeInteractor2);
    });
  });

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

      const localeInteractor: LocaleInteractor = container.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const locale: Locale = await localeInteractor.all();

      expect(locale.getLanguage(0).get().getLanguageID().get()).toEqual(1);
      expect(locale.getLanguage(0).get().getName().get()).toEqual('аҧсуа бызшәа');
      expect(locale.getLanguage(0).get().getEnglishName().get()).toEqual('Abkhazian');
      expect(locale.getLanguage(0).get().getISO639().get()).toEqual('ab');
      expect(locale.getLanguage(1).get().getLanguageID().get()).toEqual(2);
      expect(locale.getLanguage(1).get().getName().get()).toEqual('Afaraf');
      expect(locale.getLanguage(1).get().getEnglishName().get()).toEqual('Afar');
      expect(locale.getLanguage(1).get().getISO639().get()).toEqual('aa');
      expect(locale.getRegion(0).get().getRegionID().get()).toEqual(1);
      expect(locale.getRegion(0).get().getName().get()).toEqual('Afghanistan');
      expect(locale.getRegion(0).get().getISO3166().get()).toEqual('AFG');
      expect(locale.getRegion(1).get().getRegionID().get()).toEqual(2);
      expect(locale.getRegion(1).get().getName().get()).toEqual('Albania');
      expect(locale.getRegion(1).get().getISO3166().get()).toEqual('ALB');
    });
  });

  describe('delete', () => {
    it('normal case', async () => {
      const stub1: SinonStub = sinon.stub();
      LanguageCommand.prototype.deleteAll = stub1;
      stub1.resolves(Success.of<void, CacheError>(undefined));
      const stub2: SinonStub = sinon.stub();
      RegionCommand.prototype.deleteAll = stub2;
      stub2.resolves(Success.of<void, CacheError>(undefined));

      const localeInteractor: LocaleInteractor = container.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const trial: Try<void, CacheError> = await localeInteractor.delete();

      expect(trial.isSuccess()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
    });

    it('LanguageCommand.deleteAll throws error', async () => {
      const stub1: SinonStub = sinon.stub();
      LanguageCommand.prototype.deleteAll = stub1;
      stub1.resolves(Failure.of<void, CacheError>(new CacheError('test failed')));
      const stub2: SinonStub = sinon.stub();
      RegionCommand.prototype.deleteAll = stub2;
      stub2.resolves(Success.of<void, CacheError>(undefined));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = container.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const trial: Try<void, CacheError> = await localeInteractor.delete();

      expect(trial.isFailure()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: CacheError) => {
        expect(err).toBeInstanceOf(CacheError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('RegionCommand.deleteAll throws error', async () => {
      const stub1: SinonStub = sinon.stub();
      LanguageCommand.prototype.deleteAll = stub1;
      stub1.resolves(Success.of<void, CacheError>(undefined));
      const stub2: SinonStub = sinon.stub();
      RegionCommand.prototype.deleteAll = stub2;
      stub2.resolves(Failure.of<void, CacheError>(new CacheError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const localeInteractor: LocaleInteractor = container.get<LocaleInteractor>(TYPE.LocaleInteractor);
      const trial: Try<void, CacheError> = await localeInteractor.delete();

      expect(trial.isFailure()).toEqual(true);
      expect(stub1.called).toEqual(true);
      expect(stub2.called).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: CacheError) => {
        expect(err).toBeInstanceOf(CacheError);
        spy2();
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
