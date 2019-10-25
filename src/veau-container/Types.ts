export type DIType = {
  MySQL: symbol;
  Redis: symbol;
  AuthenticationMiddleware: symbol;
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
  LanguageCommand: symbol;
  RegionCommand: symbol;
};

export const TYPE: DIType = {
  MySQL: Symbol('MySQL'),
  Redis: Symbol('Redis'),
  AuthenticationMiddleware: Symbol('AuthenticationMiddleware'),
  AuthenticationInteractor: Symbol('AuthenticationInteractor'),
  LocaleInteractor: Symbol('LocaleInteractor'),
  StatsInteractor: Symbol('StatsInteractor'),
  LanguageQuery: Symbol('LanguageQuery'),
  RegionQuery: Symbol('RegionQuery'),
  StatsItemQuery: Symbol('StatsItemQuery'),
  StatsOutlineQuery: Symbol('StatsOutlineQuery'),
  StatsQuery: Symbol('StatsQuery'),
  StatsValueQuery: Symbol('StatsValueQuery'),
  VeauAccountQuery: Symbol('VeauAccountQuery'),
  LanguageCommand: Symbol('LanguageCommand'),
  RegionCommand: Symbol('RegionCommand')
};
