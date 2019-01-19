import 'jest';
import {SinonSpy, SinonStub} from 'sinon';
import * as sinon from 'sinon';
import {NoSuchElementError} from '../../veau-general/Error';
import {VeauDB} from '../../veau-infrastructure/VeauDB';
import {VeauRedis} from '../../veau-infrastructure/VeauRedis';
import {ISO639} from '../../veau-vo/ISO639';
import {Language} from '../../veau-vo/Language';
import {LanguageRepository} from '../LanguageRepository';

describe('LanguageRepository', () => {
  it('all: Redis has languages', async () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[{"languageID":1,"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"languageID":2,"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');
    const languageRepository: LanguageRepository = LanguageRepository.getInstance();
    const languages: Array<Language> = await languageRepository.all();

    expect(languages.length).toEqual(2);
    expect(languages[0].getLanguageID().get()).toEqual(1);
    expect(languages[0].getName()).toEqual('аҧсуа бызшәа');
    expect(languages[0].getEnglishName()).toEqual('Abkhazian');
    expect(languages[0].getISO639().get()).toEqual('ab');
    expect(languages[1].getLanguageID().get()).toEqual(2);
    expect(languages[1].getName()).toEqual('Afaraf');
    expect(languages[1].getEnglishName()).toEqual('Afar');
    expect(languages[1].getISO639().get()).toEqual('aa');
  });

  it('all: Redis does not have languages', async () => {
    const stub1: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub1;
    stub1.returns(null);
    const stub2: SinonStub = sinon.stub();
    VeauDB.query = stub2;
    stub2.returns([
      {
        languageID: 1,
        name: 'аҧсуа бызшәа',
        englishName: 'Abkhazian',
        iso639: 'ab'
      },
      {
        languageID: 2,
        name: 'Afaraf',
        englishName: 'Afar',
        iso639: 'aa'
      }
    ]);
    const spy: SinonSpy = sinon.spy();
    VeauRedis.getString().set = spy;
    const languageRepository: LanguageRepository = LanguageRepository.getInstance();
    const languages: Array<Language> = await languageRepository.all();

    expect(languages.length).toEqual(2);
    expect(languages[0].getLanguageID().get()).toEqual(1);
    expect(languages[0].getName()).toEqual('аҧсуа бызшәа');
    expect(languages[0].getEnglishName()).toEqual('Abkhazian');
    expect(languages[0].getISO639().get()).toEqual('ab');
    expect(languages[1].getLanguageID().get()).toEqual(2);
    expect(languages[1].getName()).toEqual('Afaraf');
    expect(languages[1].getEnglishName()).toEqual('Afar');
    expect(languages[1].getISO639().get()).toEqual('aa');
    expect(spy.called).toEqual(true);
  });

  it('findByISO639', async () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[{"languageID":1,"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"languageID":2,"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');
    const languageRepository: LanguageRepository = LanguageRepository.getInstance();
    const language: Language = await languageRepository.findByISO639(ISO639.of('aa'));

    expect(language.getLanguageID().get()).toEqual(2);
    expect(language.getName()).toEqual('Afaraf');
    expect(language.getEnglishName()).toEqual('Afar');
  });

  it('findByISO639: throws error', () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[]');
    const languageRepository: LanguageRepository = LanguageRepository.getInstance();

    expect(languageRepository.findByISO639(ISO639.of('ac'))).rejects.toThrow(NoSuchElementError);
  });
});
