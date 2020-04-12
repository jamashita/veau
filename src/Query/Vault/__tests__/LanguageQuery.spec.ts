import 'reflect-metadata';
import sinon, { SinonSpy, SinonStub } from 'sinon';
import { vault } from '../../../Container/Container';
import { TYPE } from '../../../Container/Types';
import { NoSuchElementError } from '../../../Error/NoSuchElementError';
import { AJAXError } from '../../../General/AJAX/AJAXError';
import { DataSourceError } from '../../../General/DataSourceError';
import { Failure } from '../../../General/Try/Failure';
import { Success } from '../../../General/Try/Success';
import { Try } from '../../../General/Try/Try';
import { ISO3166 } from '../../../VO/ISO3166';
import { ISO639 } from '../../../VO/ISO639';
import { Language } from '../../../VO/Language';
import { LanguageID } from '../../../VO/LanguageID';
import { LanguageName } from '../../../VO/LanguageName';
import { Languages } from '../../../VO/Languages';
import { Locale } from '../../../VO/Locale';
import { Region } from '../../../VO/Region';
import { RegionID } from '../../../VO/RegionID';
import { RegionName } from '../../../VO/RegionName';
import { Regions } from '../../../VO/Regions';
import { MockLocaleQuery } from '../../Mock/MockLocaleQuery';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      const languageQuery1: LanguageQuery = vault.get<LanguageQuery>(TYPE.LanguageVaultQuery);
      const languageQuery2: LanguageQuery = vault.get<LanguageQuery>(TYPE.LanguageVaultQuery);

      expect(languageQuery1).toBeInstanceOf(LanguageQuery);
      expect(languageQuery1).toBe(languageQuery2);
    });
  });

  describe('all', () => {
    it('normal case', async () => {
      const locale: Locale = Locale.of(
        Languages.ofArray([
          Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
          Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
        ]),
        Regions.ofArray([
          Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
          Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
        ])
      );

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Success.of<Locale, DataSourceError>(locale));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const trial: Try<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get()).toEqual(locale.getLanguages());
    });

    it('LocaleQuery returns Failure', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Failure.of<Locale, DataSourceError>(new AJAXError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const trial: Try<Languages, NoSuchElementError | DataSourceError> = await languageQuery.all();

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(DataSourceError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });

  describe('findByISO639', () => {
    it('normal case', async () => {
      const locale: Locale = Locale.of(
        Languages.ofArray([
          Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
          Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
        ]),
        Regions.ofArray([
          Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
          Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
        ])
      );

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Success.of<Locale, DataSourceError>(locale));

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const trial: Try<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(trial.isSuccess()).toEqual(true);
      expect(trial.get()).toEqual(locale.getLanguages().get(1).get());
    });

    it('LocaleQuery.all returns Failure', async () => {
      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Failure.of<Locale, DataSourceError>(new AJAXError('test failed')));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const trial: Try<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('aa'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(DataSourceError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });

    it('no match results', async () => {
      const locale: Locale = Locale.of(
        Languages.ofArray([
          Language.of(LanguageID.of(1), LanguageName.of('аҧсуа бызшәа'), LanguageName.of('Abkhazian'), ISO639.of('ab')),
          Language.of(LanguageID.of(2), LanguageName.of('Afaraf'), LanguageName.of('Afar'), ISO639.of('aa'))
        ]),
        Regions.ofArray([
          Region.of(RegionID.of(1), RegionName.of('Afghanistan'), ISO3166.of('AFG')),
          Region.of(RegionID.of(2), RegionName.of('Albania'), ISO3166.of('ALB'))
        ])
      );

      const localeVaultQuery: MockLocaleQuery = new MockLocaleQuery();
      const stub: SinonStub = sinon.stub();
      localeVaultQuery.all = stub;
      stub.resolves(Success.of<Locale, DataSourceError>(locale));
      const spy1: SinonSpy = sinon.spy();
      const spy2: SinonSpy = sinon.spy();

      const languageQuery: LanguageQuery = new LanguageQuery(localeVaultQuery);
      const trial: Try<Language, NoSuchElementError | DataSourceError> = await languageQuery.findByISO639(ISO639.of('oop'));

      expect(trial.isFailure()).toEqual(true);
      trial.match<void>(() => {
        spy1();
      }, (err: NoSuchElementError | DataSourceError) => {
        spy2();
        expect(err).toBeInstanceOf(NoSuchElementError);
      });

      expect(spy1.called).toEqual(false);
      expect(spy2.called).toEqual(true);
    });
  });
});
