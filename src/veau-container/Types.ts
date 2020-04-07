export type DIType = Readonly<{
  SessionAJAXCommand: symbol;
  StatsAJAXCommand: symbol;
  LocaleHeapCommand: symbol;
  LanguageRedisCommand: symbol;
  RegionRedisCommand: symbol;
  EntranceSaga: symbol;
  IdentitySaga: symbol;
  LogoutSaga: symbol;
  RedirectSaga: symbol;
  RootSaga: symbol;
  StatsEditSaga: symbol;
  StatsListSaga: symbol;
  AuthenticationMiddleware: symbol;
  AJAX: symbol;
  Vault: symbol;
  MySQL: symbol;
  Redis: symbol;
  AuthenticationInteractor: symbol;
  LocaleInteractor: symbol;
  StatsInteractor: symbol;
  LocaleAJAXQuery: symbol;
  SessionAJAXQuery: symbol;
  StatsOutlineAJAXQuery: symbol;
  StatsAJAXQuery: symbol;
  LocaleHeapQuery: symbol;
  LanguageKernelQuery: symbol;
  RegionKernelQuery: symbol;
  AccountMySQLQuery: symbol;
  LanguageMySQLQuery: symbol;
  RegionMySQLQuery: symbol;
  StatsItemMySQLQuery: symbol;
  StatsOutlineMySQLQuery: symbol;
  StatsMySQLQuery: symbol;
  StatsValueMySQLQuery: symbol;
  LanguageRedisQuery: symbol;
  RegionRedisQuery: symbol;
  LanguageVaultQuery: symbol;
  LocaleVaultQuery: symbol;
  RegionVaultQuery: symbol;
}>;

export const TYPE: DIType = {
  SessionAJAXCommand: Symbol('SessionAJAXCommand'),
  StatsAJAXCommand: Symbol('StatsAJAXCommand'),
  LocaleHeapCommand: Symbol('LocaleHeapCommand'),
  LanguageRedisCommand: Symbol('LanguageRedisCommand'),
  RegionRedisCommand: Symbol('RegionRedisCommand'),
  EntranceSaga: Symbol('EntranceSaga'),
  IdentitySaga: Symbol('IdentitySaga'),
  LogoutSaga: Symbol('LogoutSaga'),
  RedirectSaga: Symbol('RedirectSaga'),
  RootSaga: Symbol('RootSaga'),
  StatsEditSaga: Symbol('StatsEditSaga'),
  StatsListSaga: Symbol('StatsListSaga'),
  AuthenticationMiddleware: Symbol('AuthenticationMiddleware'),
  AJAX: Symbol('AJAX'),
  Vault: Symbol('Vault'),
  MySQL: Symbol('MySQL'),
  Redis: Symbol('Redis'),
  AuthenticationInteractor: Symbol('AuthenticationInteractor'),
  LocaleInteractor: Symbol('LocaleInteractor'),
  StatsInteractor: Symbol('StatsInteractor'),
  LocaleAJAXQuery: Symbol('LocaleAJAXQuery'),
  SessionAJAXQuery: Symbol('SessionAJAXQuery'),
  StatsOutlineAJAXQuery: Symbol('StatsOutlineAJAXQuery'),
  StatsAJAXQuery: Symbol('StatsAJAXQuery'),
  LocaleHeapQuery: Symbol('LocaleHeapQuery'),
  LanguageKernelQuery: Symbol('LanguageKernelQuery'),
  RegionKernelQuery: Symbol('RegionKernelQuery'),
  AccountMySQLQuery: Symbol('AccountMySQLQuery'),
  LanguageMySQLQuery: Symbol('LanguageMySQLQuery'),
  RegionMySQLQuery: Symbol('RegionMySQLQuery'),
  StatsItemMySQLQuery: Symbol('StatsItemMySQLQuery'),
  StatsOutlineMySQLQuery: Symbol('StatsOutlineMySQLQuery'),
  StatsMySQLQuery: Symbol('StatsMySQLQuery'),
  StatsValueMySQLQuery: Symbol('StatsValueMySQLQuery'),
  LanguageRedisQuery: Symbol('LanguageRedisQuery'),
  RegionRedisQuery: Symbol('RegionRedisQuery'),
  LanguageVaultQuery: Symbol('LanguageVaultQuery'),
  LocaleVaultQuery: Symbol('LocaleVaultQuery'),
  RegionVaultQuery: Symbol('RegionVaultQuery')
};
