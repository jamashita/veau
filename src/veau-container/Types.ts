export type DIType = {
  LanguageCommand: symbol;
  RegionCommand: symbol;
  AuthenticationMiddleware: symbol;
  MySQL: symbol;
  Redis: symbol;
  AuthenticationInteractor: symbol;
  LocaleInteractor: symbol;
  StatsInteractor: symbol;
  AccountQuery: symbol;
  LanguageQuery: symbol;
  AccountMySQLQuery: symbol;
  LanguageMySQLQuery: symbol;
  RegionMySQLQuery: symbol;
  StatsValueMySQLQuery: symbol;
  LanguageRedisQuery: symbol;
  RegionRedisQuery: symbol;
  RegionQuery: symbol;
  StatsItemQuery: symbol;
  StatsOutlineQuery: symbol;
  StatsQuery: symbol;
  StatsValueQuery: symbol;
};

export const TYPE: DIType = {
  LanguageCommand: Symbol('LanguageCommand'),
  RegionCommand: Symbol('RegionCommand'),
  AuthenticationMiddleware: Symbol('AuthenticationMiddleware'),
  MySQL: Symbol('MySQL'),
  Redis: Symbol('Redis'),
  AuthenticationInteractor: Symbol('AuthenticationInteractor'),
  LocaleInteractor: Symbol('LocaleInteractor'),
  StatsInteractor: Symbol('StatsInteractor'),
  AccountQuery: Symbol('AccountQuery'),
  LanguageQuery: Symbol('LanguageQuery'),
  AccountMySQLQuery: Symbol('AccountMySQLQuery'),
  LanguageMySQLQuery: Symbol('LanguageMySQLQuery'),
  RegionMySQLQuery: Symbol('RegionMySQLQuery'),
  StatsValueMySQLQuery: Symbol('StatsValueMySQLQuery'),
  LanguageRedisQuery: Symbol('LanguageRedisQuery'),
  RegionRedisQuery: Symbol('RegionRedisQuery'),
  RegionQuery: Symbol('RegionQuery'),
  StatsItemQuery: Symbol('StatsItemQuery'),
  StatsOutlineQuery: Symbol('StatsOutlineQuery'),
  StatsQuery: Symbol('StatsQuery'),
  StatsValueQuery: Symbol('StatsValueQuery')
};
