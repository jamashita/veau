export type DIType = {
  LanguageCommand: symbol;
  RegionCommand: symbol;
  AuthenticationMiddleware: symbol;
  MySQL: symbol;
  Redis: symbol;
  AuthenticationInteractor: symbol;
  LocaleInteractor: symbol;
  StatsInteractor: symbol;
  LanguageQuery: symbol;
  RegionQuery: symbol;
  StatsItemQuery: symbol;
  StatsOutlineQuery: symbol;
  StatsQuery: symbol;
  StatsValueQuery: symbol;
  VeauAccountQuery: symbol;
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
  LanguageQuery: Symbol('LanguageQuery'),
  RegionQuery: Symbol('RegionQuery'),
  StatsItemQuery: Symbol('StatsItemQuery'),
  StatsOutlineQuery: Symbol('StatsOutlineQuery'),
  StatsQuery: Symbol('StatsQuery'),
  StatsValueQuery: Symbol('StatsValueQuery'),
  VeauAccountQuery: Symbol('VeauAccountQuery')
};