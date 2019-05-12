/* tslint:disable */
import 'jest';
import * as moment from 'moment';
import * as sinon from 'sinon';
import { SinonSpy, SinonStub } from 'sinon';
import { StatsItems } from '../../veau-collection/StatsItems';
import { StatsValues } from '../../veau-collection/StatsValues';
import { Language } from '../../veau-entity/Language';
import { Region } from '../../veau-entity/Region';
import { Stats, StatsJSON } from '../../veau-entity/Stats';
import { StatsItem } from '../../veau-entity/StatsItem';
import { Term } from '../../veau-enum/Term';
import { NoSuchElementError } from '../../veau-error/NoSuchElementError';
import { NotFoundError } from '../../veau-error/NotFoundError';
import { VeauMySQL } from '../../veau-infrastructure/VeauMySQL';
import { StatsQuery } from '../../veau-query/StatsQuery';
import { ISO3166 } from '../../veau-vo/ISO3166';
import { ISO639 } from '../../veau-vo/ISO639';
import { LanguageID } from '../../veau-vo/LanguageID';
import { RegionID } from '../../veau-vo/RegionID';
import { StatsID } from '../../veau-vo/StatsID';
import { StatsItemID } from '../../veau-vo/StatsItemID';
import { UUID } from '../../veau-vo/UUID';
import { VeauAccountID } from '../../veau-vo/VeauAccountID';
import { StatsUseCase } from '../StatsUseCase';

describe('StatsUseCase', () => {
  it('findByStatsID: normal case', async () => {
    const statsID: StatsID = StatsID.of(UUID.of('9016f5d7-654e-4903-bfc9-a89c40919e94'));
    const language: Language = new Language(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
    const region: Region = new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
    const term: Term = Term.MONTHLY;
    const name: string = 'stats';
    const unit: string = 'unit';
    const updatedAt: moment.Moment = moment.utc();
    const items: StatsItems = new StatsItems([
      new StatsItem(StatsItemID.of(UUID.of('e4acd635-c9bc-4957-ba4d-4d299a08949b')), 'item1', new StatsValues([])),
      new StatsItem(StatsItemID.of(UUID.of('7680c494-158b-43ec-9846-d37d513cf4d8')), 'item2', new StatsValues([])),
    ]);

    const stub: SinonStub = sinon.stub();
    StatsQuery.prototype.findByStatsID = stub;
    stub.resolves(new Stats(
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt,
      items
    ));

    const statsUaseCase: StatsUseCase = StatsUseCase.getInstance();
    const json: StatsJSON = await statsUaseCase.findByStatsID(StatsID.of(UUID.of('9016f5d7-654e-4903-bfc9-a89c40919e94')));

    expect(json.statsID).toEqual(statsID.get().get());
    expect(json.language.name).toEqual(language.getName());
    expect(json.region.name).toEqual(region.getName());
    expect(json.termID).toEqual(term.getID());
    expect(json.name).toEqual(name);
    expect(json.unit).toEqual(unit);
    expect(json.updatedAt).toEqual(updatedAt.format('YYYY-MM-DD HH:mm:ss'));
    expect(json.items.length).toEqual(items.length());
  });

  it('findByStatsID: thrown NoSuchElementError', () => {
    const stub: SinonStub = sinon.stub();
    StatsQuery.prototype.findByStatsID = stub;
    stub.rejects(new NoSuchElementError(''));

    const statsUaseCase: StatsUseCase = StatsUseCase.getInstance();

    expect(statsUaseCase.findByStatsID(StatsID.of(UUID.of('9016f5d7-654e-4903-bfc9-a89c40919e94')))).rejects.toThrow(NotFoundError);
  });

  it('findByStatsID: thrown Error', () => {
    const stub: SinonStub = sinon.stub();
    StatsQuery.prototype.findByStatsID = stub;
    stub.rejects(new Error());

    const statsUaseCase: StatsUseCase = StatsUseCase.getInstance();

    expect(statsUaseCase.findByStatsID(StatsID.of(UUID.of('9016f5d7-654e-4903-bfc9-a89c40919e94')))).rejects.toThrow(Error);
  });

  it('findByVeauAccountID: normal case', async () => {
    const statsID: StatsID = StatsID.of(UUID.of('9016f5d7-654e-4903-bfc9-a89c40919e94'));
    const language: Language = new Language(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
    const region: Region = new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
    const term: Term = Term.MONTHLY;
    const name: string = 'stats';
    const unit: string = 'unit';
    const updatedAt: moment.Moment = moment.utc();
    const items: StatsItems = new StatsItems([
      new StatsItem(StatsItemID.of(UUID.of('e4acd635-c9bc-4957-ba4d-4d299a08949b')), 'item1', new StatsValues([])),
      new StatsItem(StatsItemID.of(UUID.of('7680c494-158b-43ec-9846-d37d513cf4d8')), 'item2', new StatsValues([])),
    ]);

    const stub: SinonStub = sinon.stub();
    StatsQuery.prototype.findByVeauAccountID = stub;
    stub.resolves([
      new Stats(
        statsID,
        language,
        region,
        term,
        name,
        unit,
        updatedAt,
        items
      )
    ]);

    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    const jsons: Array<StatsJSON> =  await statsUseCase.findByVeauAccountID(VeauAccountID.of(UUID.of('cfd6a7f1-b583-443e-9831-bdfc7621b0d2')), 1);

    expect(jsons.length).toEqual(1);
    expect(jsons[0].statsID).toEqual(statsID.get().get());
    expect(jsons[0].language.name).toEqual(language.getName());
    expect(jsons[0].region.name).toEqual(region.getName());
    expect(jsons[0].termID).toEqual(term.getID());
    expect(jsons[0].name).toEqual(name);
    expect(jsons[0].unit).toEqual(unit);
    expect(jsons[0].updatedAt).toEqual(updatedAt.format('YYYY-MM-DD HH:mm:ss'));
    expect(jsons[0].items.length).toEqual(2);
  });

  it('save: normal case', async () => {
    const statsID: StatsID = StatsID.of(UUID.of('9016f5d7-654e-4903-bfc9-a89c40919e94'));
    const language: Language = new Language(LanguageID.of(1), 'аҧсуа бызшәа', 'Abkhazian', ISO639.of('ab'));
    const region: Region = new Region(RegionID.of(1), 'Afghanistan', ISO3166.of('AFG'));
    const term: Term = Term.MONTHLY;
    const name: string = 'stats';
    const unit: string = 'unit';
    const updatedAt: moment.Moment = moment.utc();
    const items: StatsItems = new StatsItems([
      new StatsItem(StatsItemID.of(UUID.of('e4acd635-c9bc-4957-ba4d-4d299a08949b')), 'item1', new StatsValues([])),
      new StatsItem(StatsItemID.of(UUID.of('7680c494-158b-43ec-9846-d37d513cf4d8')), 'item2', new StatsValues([])),
    ]);

    const stats: Stats = new Stats(
      statsID,
      language,
      region,
      term,
      name,
      unit,
      updatedAt,
      items
    );

    const spy: SinonSpy = sinon.spy();
    VeauMySQL.transact = spy;

    const statsUseCase: StatsUseCase = StatsUseCase.getInstance();
    await statsUseCase.save(VeauAccountID.of(UUID.of('cfd6a7f1-b583-443e-9831-bdfc7621b0d2')), stats);

    expect(spy.called).toEqual(true);
  });
});
