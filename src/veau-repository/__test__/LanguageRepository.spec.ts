import 'jest';
import * as sinon from 'sinon';
import {NoSuchElementError} from '../../veau-general/Error';
import {VeauRedis} from '../../veau-infrastructure/VeauRedis';
import {ISO639} from '../../veau-vo/ISO639';
import {Language} from '../../veau-vo/Language';
import {LanguageRepository} from '../LanguageRepository';

describe('LanguageRepository', () => {
  it('all', async () => {
    const stub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[{"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');
    const languageRepository: LanguageRepository = LanguageRepository.getInstance();
    const languages: Array<Language> = await languageRepository.all();

    expect(languages.length).toEqual(2);
    expect(languages[0].getISO639().get()).toEqual('ab');
    expect(languages[1].getISO639().get()).toEqual('aa');
  });

  it('findByISO639', async () => {
    const stub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[{"name":"аҧсуа бызшәа","englishName":"Abkhazian","iso639":"ab"},{"name":"Afaraf","englishName":"Afar","iso639":"aa"}]');
    const languageRepository: LanguageRepository = LanguageRepository.getInstance();
    const language: Language = await languageRepository.findByISO639(new ISO639('aa'));

    expect(language.getISO639().get()).toEqual('aa');
  });

  it('findByISO639: throws error', async () => {
    const stub = sinon.stub();
    VeauRedis.getString().get = stub;
    stub.returns('[]');
    const languageRepository: LanguageRepository = LanguageRepository.getInstance();

    await expect(languageRepository.findByISO639(new ISO639('ac'))).rejects.toThrow(NoSuchElementError);
  });
});
