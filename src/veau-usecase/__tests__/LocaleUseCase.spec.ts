/* tslint:disable */
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
import { Locales, LocaleUseCase } from '../LocaleUseCase';

describe('LocaleUseCase',  () => {
  it('all', async () => {
    const stub1: SinonStub = sinon.stub();
    LanguageQuery.prototype.all = stub1;
    stub1.resolves([
      new Language(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab')),
      new Language(LanguageID.of(2), 'Afaraf', 'Afar', ISO639.of('aa'))
    ]);
    const stub2: SinonStub = sinon.stub();
    RegionQuery.prototype.all = stub2;
    stub2.resolves([
      new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG')),
      new Region(RegionID.of(2), 'Albania', ISO3166.of('ALB'))
    ]);

    const localeUseCase: LocaleUseCase = LocaleUseCase.getInstance();
    const locales: Locales = await localeUseCase.all();

    expect(locales.languages.length).toEqual(2);
    expect(locales.languages[0].languageID).toEqual(1);
    expect(locales.languages[0].name).toEqual('аҧсуа бызшәа');
    expect(locales.languages[0].englishName).toEqual('Abkhazian');
    expect(locales.languages[0].iso639).toEqual('ab');
    expect(locales.languages[1].languageID).toEqual(2);
    expect(locales.languages[1].name).toEqual('Afaraf');
    expect(locales.languages[1].englishName).toEqual('Afar');
    expect(locales.languages[1].iso639).toEqual('aa');
    expect(locales.regions.length).toEqual(2);
    expect(locales.regions[0].regionID).toEqual(1);
    expect(locales.regions[0].name).toEqual('Afghanistan');
    expect(locales.regions[0].iso3166).toEqual('AFG');
    expect(locales.regions[1].regionID).toEqual(2);
    expect(locales.regions[1].name).toEqual('Albania');
    expect(locales.regions[1].iso3166).toEqual('ALB');
  });

  it('delete', async () => {
    const spy1: SinonSpy = sinon.spy();
    LanguageCommand.prototype.deleteAll = spy1;
    const spy2: SinonSpy = sinon.spy();
    RegionCommand.prototype.deleteAll = spy2

    const localeUseCase: LocaleUseCase = LocaleUseCase.getInstance();
    await localeUseCase.delete();

    expect(spy1.called).toEqual(true);
    expect(spy2.called).toEqual(true);
  });
});
