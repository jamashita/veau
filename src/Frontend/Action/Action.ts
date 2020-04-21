import { CallHistoryMethodAction, LocationChangeAction } from 'connected-react-router';
import { Action as ReduxAction } from 'redux';
import { Stats } from '../../Entity/Stats';
import { StatsItem } from '../../Entity/StatsItem';
import { Present } from '../../General/Quantum/Present';
import { Quantum } from '../../General/Quantum/Quantum';
import { AccountName } from '../../VO/AccountName';
import { AsOf } from '../../VO/AsOf';
import { Column } from '../../VO/Column';
import { Coordinate } from '../../VO/Coordinate';
import { EntranceInformation } from '../../VO/EntranceInformation';
import { ISO3166 } from '../../VO/ISO3166';
import { ISO639 } from '../../VO/ISO639';
import { Locale } from '../../VO/Locale';
import { NumericalValue } from '../../VO/NumericalValue';
import { Password } from '../../VO/Password';
import { Row } from '../../VO/Row';
import { StatsID } from '../../VO/StatsID';
import { StatsItemName } from '../../VO/StatsItemName';
import { StatsName } from '../../VO/StatsName';
import { StatsOutlines } from '../../VO/StatsOutlines';
import { StatsUnit } from '../../VO/StatsUnit';
import { Term } from '../../VO/Term';
import { VeauAccount } from '../../VO/VeauAccount';

export type NotificationKind = 'info' | 'success' | 'warn' | 'error';
export type NotificationHPosition = 'left' | 'center' | 'right';
export type NotificationVPosition = 'top' | 'bottom';

export const ACTION = {
  LOCATION_CHANGE: '@@router/LOCATION_CHANGE',
  CALL_HISTORY_METHOD: '@@router/CALL_HISTORY_METHOD',

  MODAL_RAISE: '@@veau/MODAL_RAISE',
  MODAL_CLOSE: '@@veau/MODAL_CLOSE',

  NOTIFICATION_APPEAR: '@@veau/NOTIFICATION_APPEAR',
  NOTIFICATION_DISAPPEAR: '@@veau/NOTIFICATION_DISAPPEAR',

  LOADING_START: '@@veau/LOADING_START',
  LOADING_FINISH: '@@veau/LOADING_FINISH',

  IDENTITY_AUTHENTICATE: '@@veau/IDENTITY_AUTHENTICATE',
  IDENTITY_AUTHENTICATED: '@@veau/IDENTITY_AUTHENTICATED',
  IDENTITY_INITIALIZE: '@@veau/IDENTITY_INITIALIZE',
  IDENTITY_IDENTIFIED: '@@veau/IDENTITY_IDENTIFIED',

  LOGOUT: '@@veau/LOGOUT',

  PUSH_TO_STATS_LIST: '@@veau/PUSH_TO_STATS_LIST',
  PUSH_TO_STATS_EDIT: '@@veau/PUSH_TO_STATS_EDIT',
  PUSH_TO_ENTRANCE: '@@veau/PUSH_TO_ENTRANCE',

  PROVIDER_OPEN: '@@veau/PROVIDER_OPEN',
  PROVIDER_CLOSE: '@@veau/PROVIDER_CLOSE',

  LOCALE_DEFINED: '@@veau/LOCALE_DEFINED',

  ENTRANCE_ACCOUNT_NAME_TYPED: '@@veau/ENTRANCE_ACCOUNT_NAME_TYPED',
  ENTRANCE_PASSWORD_TYPED: '@@veau/ENTRANCE_PASSWORD_TYPED',
  ENTRANCE_UPDATE: '@@veau/ENTRANCE_UPDATE',

  STATS_LIST_INITIALIZE: '@@veau/STATS_LIST_INITIALIZE',
  STATS_LIST_OPEN_STATS_MODAL: '@@veau/STATS_LIST_OPEN_STATS_MODAL',
  STATS_LIST_CLOSE_STATS_MODAL: '@@veau/STATS_LIST_CLOSE_STATS_MODAL',
  STATS_LIST_NAME_TYPED: '@@veau/STATS_LIST_NAME_TYPED',
  STATS_LIST_UNIT_TYPED: '@@veau/STATS_LIST_UNIT_TYPED',
  STATS_LIST_ISO639_SELECTED: '@@veau/STATS_LIST_ISO639_SELECTED',
  STATS_LIST_ISO3166_SELECTED: '@@veau/STATS_LIST_ISO3166_SELECTED',
  STATS_LIST_TERM_SELECTED: '@@veau/STATS_LIST_TERM_SELECTED',
  STATS_LIST_UPDATE_NEW_STATS: '@@veau/STATS_LIST_UPDATE_NEW_STATS',
  STATS_LIST_RESET_NEW_STATS: '@@veau/STATS_LIST_RESET_NEW_STATS',
  STATS_LIST_SAVE_NEW_STATS: '@@veau/STATS_LIST_SAVE_NEW_STATS',

  STATS_EDIT_INITIALIZE: '@@veau/STATS_EDIT_INITIALIZE',
  STATS_EDIT_INITIALIZATION_FAILURE: '@@veau/STATS_EDIT_INITIALIZATION_FAILURE',
  STATS_EDIT_NAME_TYPED: '@@veau/STATS_EDIT_NAME_TYPED',
  STATS_EDIT_UNIT_TYPED: '@@veau/STATS_EDIT_UNIT_TYPED',
  STATS_EDIT_ISO639_SELECTED: '@@veau/STATS_EDIT_ISO639_SELECTED',
  STATS_EDIT_ISO3166_SELECTED: '@@veau/STATS_EDIT_ISO3166_SELECTED',
  STATS_EDIT_ITEM_NAME_TYPED: '@@veau/STATS_EDIT_ITEM_NAME_TYPED',
  STATS_EDIT_ITEM_SAVE: '@@veau/STATS_EDIT_ITEM_SAVE',
  STATS_EDIT_SELECT_ITEM: '@@veau/STATS_EDIT_SELECT_ITEM',
  STATS_EDIT_SELECTING_ITEM_NAME_TYPED: '@@veau/STATS_EDIT_SELECTING_ITEM_NAME_TYPED',
  STATS_EDIT_UPDATE_SELECTING_ITEM: '@@veau/STATS_EDIT_UPDATE_SELECTING_ITEM',
  STATS_EDIT_REMOVE_SELECTING_ITEM: '@@veau/STATS_EDIT_REMOVE_SELECTING_ITEM',
  STATS_EDIT_CLEAR_SELECTING_ITEM: '@@veau/STATS_EDIT_CLEAR_SELECTING_ITEM',
  STATS_EDIT_START_DATE_DETERMINED: '@@veau/STATS_EDIT_START_DATE_DETERMINED',
  STATS_EDIT_INVALID_DATE_INPUT: '@@veau/STATS_EDIT_INVALID_DATE_INPUT',
  STATS_EDIT_DATA_FILLED: '@@veau/STATS_EDIT_DATA_FILLED',
  STATS_EDIT_DATA_DELETED: '@@veau/STATS_EDIT_DATA_DELETED',
  STATS_EDIT_ROW_SELECTED: '@@veau/STATS_EDIT_ROW_SELECTED',
  STATS_EDIT_ROW_MOVED: '@@veau/STATS_EDIT_ROW_MOVED',
  STATS_EDIT_INVALID_VALUE_INPUT: '@@veau/STATS_EDIT_INVALID_VALUE_INPUT',
  STATS_EDIT_SAVE_STATS: '@@veau/STATS_EDIT_SAVE_STATS',

  STATS_OUTLINE_UPDATE: '@@veau/STATS_OUTLINE_UPDATE',
  STATS_OUTLINE_RESET: '@@veau/STATS_OUTLINE_RESET',
  STATS_UPDATE: '@@veau/STATS_UPDATE',
  STATS_RESET: '@@veau/STATS_RESET',
  STATS_ITEM_UPDATE: '@@veau/STATS_ITEM_UPDATE',
  STATS_ITEM_RESET: '@@veau/STATS_ITEM_RESET'
} as const;

export interface ChangeAction extends LocationChangeAction, ReduxAction {
  readonly type: typeof ACTION.LOCATION_CHANGE;
}

export interface CallHistoryAction extends CallHistoryMethodAction<Array<unknown>>, ReduxAction {
  readonly type: typeof ACTION.CALL_HISTORY_METHOD;
}

export interface ModalRaiseAction extends ReduxAction {
  readonly type: typeof ACTION.MODAL_RAISE;
  readonly title: string;
  readonly description: string;
  readonly values?: Record<string, string>;
}

export interface ModalCloseAction extends ReduxAction {
  readonly type: typeof ACTION.MODAL_CLOSE;
}

export interface NotificationAppearAction extends ReduxAction {
  readonly type: typeof ACTION.NOTIFICATION_APPEAR;
  readonly kind: NotificationKind;
  readonly horizontal: NotificationHPosition;
  readonly vertical: NotificationVPosition;
  readonly message: string;
  readonly duration: number;
  readonly values?: Record<string, string>;
}

export interface NotificationDisappearAction extends ReduxAction {
  readonly type: typeof ACTION.NOTIFICATION_DISAPPEAR;
}

export interface LoadingStartAction extends ReduxAction {
  readonly type: typeof ACTION.LOADING_START;
}

export interface LoadingFinishAction extends ReduxAction {
  readonly type: typeof ACTION.LOADING_FINISH;
}

export interface IdentityAuthenticateAction extends ReduxAction {
  readonly type: typeof ACTION.IDENTITY_AUTHENTICATE;
}

export interface IdentityAuthenticatedAction extends ReduxAction {
  readonly type: typeof ACTION.IDENTITY_AUTHENTICATED;
  readonly identity: VeauAccount;
}

export interface IdentityInitializeAction extends ReduxAction {
  readonly type: typeof ACTION.IDENTITY_INITIALIZE;
}

export interface IdentityIdentifiedAction extends ReduxAction {
  readonly type: typeof ACTION.IDENTITY_IDENTIFIED;
}

export interface LogoutAction extends ReduxAction {
  readonly type: typeof ACTION.LOGOUT;
}

export interface PushToStatsListAction extends ReduxAction {
  readonly type: typeof ACTION.PUSH_TO_STATS_LIST;
}

export interface PushToStatsEditAction extends ReduxAction {
  readonly type: typeof ACTION.PUSH_TO_STATS_EDIT;
  readonly statsID: StatsID;
}

export interface PushToEntranceAction extends ReduxAction {
  readonly type: typeof ACTION.PUSH_TO_ENTRANCE;
}

export interface ProviderOpenAction extends ReduxAction {
  readonly type: typeof ACTION.PROVIDER_OPEN;
}

export interface ProviderCloseAction extends ReduxAction {
  readonly type: typeof ACTION.PROVIDER_CLOSE;
}

export interface LocaleDefinedAction extends ReduxAction {
  readonly type: typeof ACTION.LOCALE_DEFINED;
  readonly locale: Locale;
}

export interface EntranceAccountNameTypedAction extends ReduxAction {
  readonly type: typeof ACTION.ENTRANCE_ACCOUNT_NAME_TYPED;
  readonly account: AccountName;
}

export interface EntrancePasswordTypedAction extends ReduxAction {
  readonly type: typeof ACTION.ENTRANCE_PASSWORD_TYPED;
  readonly password: Password;
}

export interface EntranceUpdateAction extends ReduxAction {
  readonly type: typeof ACTION.ENTRANCE_UPDATE;
  readonly entranceInformation: EntranceInformation;
}

export interface StatsListInitializeAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_LIST_INITIALIZE;
}

export interface StatsListOpenNewStatsModalAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_LIST_OPEN_STATS_MODAL;
}

export interface StatsListCloseNewStatsModalAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_LIST_CLOSE_STATS_MODAL;
}

export interface StatsListNameTypedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_LIST_NAME_TYPED;
  readonly name: StatsName;
}

export interface StatsListUnitTypedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_LIST_UNIT_TYPED;
  readonly unit: StatsUnit;
}

export interface StatsListISO639SelectedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_LIST_ISO639_SELECTED;
  readonly iso639: ISO639;
}

export interface StatsListISO3166SelectedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_LIST_ISO3166_SELECTED;
  readonly iso3166: ISO3166;
}

export interface StatsListTermSelectedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_LIST_TERM_SELECTED;
  readonly term: Term;
}

export interface StatsListUpdateNewStatsAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_LIST_UPDATE_NEW_STATS;
  readonly stats: Stats;
}

export interface StatsListResetNewStatsAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_LIST_RESET_NEW_STATS;
}

export interface StatsListSaveNewStatsAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_LIST_SAVE_NEW_STATS;
}

export interface StatsEditInitializeAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_INITIALIZE;
  readonly statsID: StatsID;
}

export interface StatsEditInitializationFailureAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_INITIALIZATION_FAILURE;
}

export interface StatsEditNameTypedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_NAME_TYPED;
  readonly name: StatsName;
}

export interface StatsEditUnitTypedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_UNIT_TYPED;
  readonly unit: StatsUnit;
}

export interface StatsEditISO639SelectedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_ISO639_SELECTED;
  readonly iso639: ISO639;
}

export interface StatsEditISO3166SelectedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_ISO3166_SELECTED;
  readonly iso3166: ISO3166;
}

export interface StatsEditItemNameTypedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_ITEM_NAME_TYPED;
  readonly name: StatsItemName;
}

export interface StatsEditItemSaveAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_ITEM_SAVE;
}

export interface StatsEditSelectItemAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_SELECT_ITEM;
  readonly statsItem: Quantum<StatsItem>;
  readonly row: Row;
}

export interface StatsEditSelectingItemNameTypedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_SELECTING_ITEM_NAME_TYPED;
  readonly name: StatsItemName;
}

export interface StatsEditUpdateSelectingItemAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_UPDATE_SELECTING_ITEM;
  readonly statsItem: Present<StatsItem>;
}

export interface StatsEditRemoveSelectingItemAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_REMOVE_SELECTING_ITEM;
  readonly statsItem: StatsItem;
}

export interface StatsEditClearSelectingItemAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_CLEAR_SELECTING_ITEM;
}

export interface StatsEditStartDateDeterminedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_START_DATE_DETERMINED;
  readonly startDate: AsOf;
}

export interface StatsEditInvalidDateInputAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_INVALID_DATE_INPUT;
}

export interface StatsEditDataFilledAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_DATA_FILLED;
  readonly coordinate: Coordinate;
  readonly value: NumericalValue;
}

export interface StatsEditDataDeletedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_DATA_DELETED;
  readonly coordinate: Coordinate;
}

export interface StatsEditRowSelectedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_ROW_SELECTED;
  readonly row: Row;
}

export interface StatsEditRowMovedAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_ROW_MOVED;
  readonly column: Column;
  readonly target: Column;
}

export interface StatsEditInvalidValueInputAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_INVALID_VALUE_INPUT;
}

export interface StatsEditSaveStatsAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_EDIT_SAVE_STATS;
}

export interface StatsOutlineUpdateAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_OUTLINE_UPDATE;
  readonly statsOutlines: StatsOutlines;
}

export interface StatsOutlineResetAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_OUTLINE_RESET;
}

export interface StatsUpdateAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_UPDATE;
  readonly stats: Stats;
}

export interface StatsResetAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_RESET;
}

export interface StatsItemUpdateAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_ITEM_UPDATE;
  readonly statsItem: StatsItem;
}

export interface StatsItemResetAction extends ReduxAction {
  readonly type: typeof ACTION.STATS_ITEM_RESET;
}

export type Action =
  ChangeAction |
  CallHistoryAction |
  ModalRaiseAction |
  ModalCloseAction |
  NotificationAppearAction |
  NotificationDisappearAction |
  LoadingStartAction |
  LoadingFinishAction |
  IdentityAuthenticateAction |
  IdentityAuthenticatedAction |
  IdentityInitializeAction |
  IdentityIdentifiedAction |
  LogoutAction |
  PushToStatsListAction |
  PushToStatsEditAction |
  PushToEntranceAction |
  ProviderOpenAction |
  ProviderCloseAction |
  LocaleDefinedAction |
  EntranceAccountNameTypedAction |
  EntrancePasswordTypedAction |
  EntranceUpdateAction |
  StatsListInitializeAction |
  StatsListOpenNewStatsModalAction |
  StatsListCloseNewStatsModalAction |
  StatsListNameTypedAction |
  StatsListUnitTypedAction |
  StatsListISO639SelectedAction |
  StatsListISO3166SelectedAction |
  StatsListTermSelectedAction |
  StatsListUpdateNewStatsAction |
  StatsListResetNewStatsAction |
  StatsListSaveNewStatsAction |
  StatsEditInitializeAction |
  StatsEditInitializationFailureAction |
  StatsEditNameTypedAction |
  StatsEditUnitTypedAction |
  StatsEditISO639SelectedAction |
  StatsEditISO3166SelectedAction |
  StatsEditItemNameTypedAction |
  StatsEditItemSaveAction |
  StatsEditSelectItemAction |
  StatsEditSelectingItemNameTypedAction |
  StatsEditUpdateSelectingItemAction |
  StatsEditRemoveSelectingItemAction |
  StatsEditClearSelectingItemAction |
  StatsEditStartDateDeterminedAction |
  StatsEditInvalidDateInputAction |
  StatsEditDataFilledAction |
  StatsEditDataDeletedAction |
  StatsEditRowSelectedAction |
  StatsEditRowMovedAction |
  StatsEditInvalidValueInputAction |
  StatsEditSaveStatsAction |
  StatsOutlineUpdateAction |
  StatsOutlineResetAction |
  StatsUpdateAction |
  StatsResetAction |
  StatsItemUpdateAction |
  StatsItemResetAction;
