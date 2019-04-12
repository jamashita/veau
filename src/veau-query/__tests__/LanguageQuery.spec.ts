/* tslint:disable */
import 'jest';
import * as sinon from 'sinon';
import { SinonSpy, SinonStub } from 'sinon';
import { NoSuchElementError } from '../../veau-general/Error/NoSuchElementError';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { VeauRedis } from '../../veau-infrastructure/VeauRedis';
import { ISO639 } from '../../veau-vo/ISO639';
import { Language } from '../../veau-vo/Language';
import { LanguageQuery } from '../LanguageQuery';

describe('LanguageQuery', () => {
  it('allLanguages: Redis has languages', async () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.resolves('[{"languageID":1,"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"languageID":2,"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');
    const languageQuery: LanguageQuery = LanguageQuery.getInstance();
    const languages: Array<Language> = await languageQuery.allLanguages();

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

  it('allLanguages: Redis does not have languages', async () => {
    const stub1: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub1;
    // @ts-ignore
    stub1.resolves(null);
    const stub2: SinonStub = sinon.stub();
    VeauMySQL.query = stub2;
    stub2.resolves([
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
    const languageQuery: LanguageQuery = LanguageQuery.getInstance();
    const languages: Array<Language> = await languageQuery.allLanguages();

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
    stub.resolves('[{"languageID":1,"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"languageID":2,"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');
    const languageQuery: LanguageQuery = LanguageQuery.getInstance();
    const language: Language = await languageQuery.findByISO639(ISO639.of('aa'));

    expect(language.getLanguageID().get()).toEqual(2);
    expect(language.getName()).toEqual('Afaraf');
    expect(language.getEnglishName()).toEqual('Afar');
  });

  it('findByISO639: throws error', () => {
    const stub: SinonStub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.resolves('[]');
    const languageQuery: LanguageQuery = LanguageQuery.getInstance();

    expect(languageQuery.findByISO639(ISO639.of('ac'))).rejects.toThrow(NoSuchElementError);
  });
});
