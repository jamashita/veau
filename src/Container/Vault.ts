import { Container } from 'inversify';
import { SessionCommand as SessionAJAXCommand } from '../Command/AJAX/SessionCommand';
import { StatsCommand as StatsAJAXCommand } from '../Command/AJAX/StatsCommand';
import { LocaleCommand as LocaleCacheCommand } from '../Command/Cache/LocaleCommand';
import { EntranceSaga } from '../Frontend/sagas/EntranceSaga';
import { IdentitySaga } from '../Frontend/sagas/IdentitySaga';
import { LogoutSaga } from '../Frontend/sagas/LogoutSaga';
import { RedirectSaga } from '../Frontend/sagas/RedirectSaga';
import { RootSaga } from '../Frontend/sagas/RootSaga';
import { StatsEditSaga } from '../Frontend/sagas/StatsEditSaga';
import { StatsListSaga } from '../Frontend/sagas/StatsListSaga';
import { AJAX } from '../General/AJAX/AJAX';
import { Cache } from '../General/Cache/Cache';
import { veauCache } from '../Infrastructure/VeauCache';
import { LocaleQuery as LocaleAJAXQuery } from '../Query/AJAX/LocaleQuery';
import { SessionQuery as SessionAJAXQuery } from '../Query/AJAX/SessionQuery';
import { StatsOutlineQuery as StatsOutlineAJAXQuery } from '../Query/AJAX/StatsOutlineQuery';
import { StatsQuery as StatsAJAXQuery } from '../Query/AJAX/StatsQuery';
import { LocaleQuery as LocaleCacheQuery } from '../Query/Cache/LocaleQuery';
import { LanguageQuery as LanguageVaultQuery } from '../Query/Vault/LanguageQuery';
import { LocaleQuery as LocaleVaultQuery } from '../Query/Vault/LocaleQuery';
import { RegionQuery as RegionVaultQuery } from '../Query/Vault/RegionQuery';
import { TYPE } from './Types';

export const vault: Container = new Container();

vault.bind<AJAX>(TYPE.AJAX).toConstantValue(new AJAX());
vault.bind<Cache>(TYPE.Cache).toConstantValue(veauCache);
vault.bind<SessionAJAXCommand>(TYPE.SessionAJAXCommand).to(SessionAJAXCommand).inSingletonScope();
vault.bind<StatsAJAXCommand>(TYPE.StatsAJAXCommand).to(StatsAJAXCommand).inSingletonScope();
vault.bind<LocaleCacheCommand>(TYPE.LocaleCacheCommand).to(LocaleCacheCommand).inSingletonScope();
vault.bind<EntranceSaga>(TYPE.EntranceSaga).to(EntranceSaga).inSingletonScope();
vault.bind<IdentitySaga>(TYPE.IdentitySaga).to(IdentitySaga).inSingletonScope();
vault.bind<LogoutSaga>(TYPE.LogoutSaga).to(LogoutSaga).inSingletonScope();
vault.bind<RedirectSaga>(TYPE.RedirectSaga).to(RedirectSaga).inSingletonScope();
vault.bind<RootSaga>(TYPE.RootSaga).to(RootSaga).inSingletonScope();
vault.bind<StatsEditSaga>(TYPE.StatsEditSaga).to(StatsEditSaga).inSingletonScope();
vault.bind<StatsListSaga>(TYPE.StatsListSaga).to(StatsListSaga).inSingletonScope();
vault.bind<LocaleAJAXQuery>(TYPE.LocaleAJAXQuery).to(LocaleAJAXQuery).inSingletonScope();
vault.bind<SessionAJAXQuery>(TYPE.SessionAJAXQuery).to(SessionAJAXQuery).inSingletonScope();
vault.bind<StatsOutlineAJAXQuery>(TYPE.StatsOutlineAJAXQuery).to(StatsOutlineAJAXQuery).inSingletonScope();
vault.bind<StatsAJAXQuery>(TYPE.StatsAJAXQuery).to(StatsAJAXQuery).inSingletonScope();
vault.bind<LocaleCacheQuery>(TYPE.LocaleCacheQuery).to(LocaleCacheQuery).inSingletonScope();
vault.bind<LanguageVaultQuery>(TYPE.LanguageVaultQuery).to(LanguageVaultQuery).inSingletonScope();
vault.bind<LocaleVaultQuery>(TYPE.LocaleVaultQuery).to(LocaleVaultQuery).inSingletonScope();
vault.bind<RegionVaultQuery>(TYPE.RegionVaultQuery).to(RegionVaultQuery).inSingletonScope();
