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
  RegionQuery: symbol;
  StatsItemQuery: symbol;
  StatsOutlineQuery: symbol;
  StatsQuery: symbol;
  StatsValueQuery: symbol;
  AccountMySQLQuery: symbol;
  LanguageMySQLQuery: symbol;
  RegionMySQLQuery: symbol;
  StatsItemMySQLQuery: symbol;
  StatsOutlineMySQLQuery: symbol;
  StatsMySQLQuery: symbol;
  StatsValueMySQLQuery: symbol;
  LanguageRedisQuery: symbol;
  RegionRedisQuery: symbol;
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
  RegionQuery: Symbol('RegionQuery'),
  StatsItemQuery: Symbol('StatsItemQuery'),
  StatsOutlineQuery: Symbol('StatsOutlineQuery'),
  StatsQuery: Symbol('StatsQuery'),
  StatsValueQuery: Symbol('StatsValueQuery'),
  AccountMySQLQuery: Symbol('AccountMySQLQuery'),
  LanguageMySQLQuery: Symbol('LanguageMySQLQuery'),
  RegionMySQLQuery: Symbol('RegionMySQLQuery'),
  StatsItemMySQLQuery: Symbol('StatsItemMySQLQuery'),
  StatsOutlineMySQLQuery: Symbol('StatsOutlineMySQLQuery'),
  StatsMySQLQuery: Symbol('StatsMySQLQuery'),
  StatsValueMySQLQuery: Symbol('StatsValueMySQLQuery'),
  LanguageRedisQuery: Symbol('LanguageRedisQuery'),
  RegionRedisQuery: Symbol('RegionRedisQuery')
};
