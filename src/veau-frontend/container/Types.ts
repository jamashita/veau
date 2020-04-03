export type DIType = {
  SessionCommand: symbol;
  StatsCommand: symbol;
  LocaleQuery: symbol;
  SessionQuery: symbol;
  StatsQuery: symbol;
  RootSaga: symbol;
};

export const TYPE: DIType = {
  SessionCommand: Symbol('SessionCommand'),
  StatsCommand: Symbol('StatsCommand'),
  LocaleQuery: Symbol('LocaleQuery'),
  SessionQuery: Symbol('SessionQuery'),
  StatsQuery: Symbol('StatsQuery'),
  RootSaga: Symbol('RootSaga')
};
