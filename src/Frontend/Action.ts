import { CallHistoryMethodAction, LocationChangeAction } from 'connected-react-router';
import { Action } from 'redux';
import { StatsDisplay } from 'src/VO/Display/StatsDisplay';

import { Heisenberg } from '@jamashita/publikum-monad';

import { Stats } from '../Entity/Stats/Stats';
import { StatsItem } from '../Entity/StatsItem/StatsItem';
import { AccountName } from '../VO/Account/AccountName';
import { AsOf } from '../VO/AsOf/AsOf';
import { Column } from '../VO/Coordinate/Column';
import { Coordinate } from '../VO/Coordinate/Coordinate';
import { Row } from '../VO/Coordinate/Row';
import { EntranceInformation } from '../VO/EntranceInformation/EntranceInformation';
import { Password } from '../VO/EntranceInformation/Password';
import { Identity } from '../VO/Identity/Identity';
import { ISO639 } from '../VO/Language/ISO639';
import { Locale } from '../VO/Locale/Locale';
import { NumericalValue } from '../VO/NumericalValue/NumericalValue';
import { ISO3166 } from '../VO/Region/ISO3166';
import { StatsItemName } from '../VO/StatsItem/StatsItemName';
import { StatsListItems } from '../VO/StatsListItem/StatsListItems';
import { StatsID } from '../VO/StatsOutline/StatsID';
import { StatsName } from '../VO/StatsOutline/StatsName';
import { StatsUnit } from '../VO/StatsOutline/StatsUnit';
import { Term } from '../VO/Term/Term';

export type NotificationKind = 'info' | 'success' | 'warn' | 'error';
export type NotificationHPosition = 'left' | 'center' | 'right';
export type NotificationVPosition = 'top' | 'bottom';

export const LOCATION_CHANGE: '@@router/LOCATION_CHANGE' = '@@router/LOCATION_CHANGE';
export const CALL_HISTORY_METHOD: '@@router/CALL_HISTORY_METHOD' = '@@router/CALL_HISTORY_METHOD';

export const NOTHING: '@@veau/NOTHING' = '@@veau/NOTHING';

export const ON_LOAD: '@@veau/ON_LOAD' = '@@veau/ON_LOAD';

export const MODAL_RAISE: '@@veau/MODAL_RAISE' = '@@veau/MODAL_RAISE';
export const MODAL_CLOSE: '@@veau/MODAL_CLOSE' = '@@veau/MODAL_CLOSE';

export const NOTIFICATION_APPEAR: '@@veau/NOTIFICATION_APPEAR' = '@@veau/NOTIFICATION_APPEAR';
export const NOTIFICATION_DISAPPEAR: '@@veau/NOTIFICATION_DISAPPEAR' = '@@veau/NOTIFICATION_DISAPPEAR';

export const LOADING_START: '@@veau/LOADING_START' = '@@veau/LOADING_START';
export const LOADING_FINISH: '@@veau/LOADING_FINISH' = '@@veau/LOADING_FINISH';

export const IDENTITY_AUTHENTICATE: '@@veau/IDENTITY_AUTHENTICATE' = '@@veau/IDENTITY_AUTHENTICATE';
export const IDENTITY_AUTHENTICATED: '@@veau/IDENTITY_AUTHENTICATED' = '@@veau/IDENTITY_AUTHENTICATED';
export const IDENTITY_INITIALIZE: '@@veau/IDENTITY_INITIALIZE' = '@@veau/IDENTITY_INITIALIZE';
export const IDENTITY_IDENTIFIED: '@@veau/IDENTITY_IDENTIFIED' = '@@veau/IDENTITY_IDENTIFIED';

export const LOGOUT: '@@veau/LOGOUT' = '@@veau/LOGOUT';

export const PUSH_TO_STATS_LIST: '@@veau/PUSH_TO_STATS_LIST' = '@@veau/PUSH_TO_STATS_LIST';
export const PUSH_TO_STATS_EDIT: '@@veau/PUSH_TO_STATS_EDIT' = '@@veau/PUSH_TO_STATS_EDIT';
export const PUSH_TO_ENTRANCE: '@@veau/PUSH_TO_ENTRANCE' = '@@veau/PUSH_TO_ENTRANCE';

export const PROVIDER_OPEN: '@@veau/PROVIDER_OPEN' = '@@veau/PROVIDER_OPEN';
export const PROVIDER_CLOSE: '@@veau/PROVIDER_CLOSE' = '@@veau/PROVIDER_CLOSE';

export const LOCALE_DEFINED: '@@veau/LOCALE_DEFINED' = '@@veau/LOCALE_DEFINED';

export const ENTRANCE_ACCOUNT_NAME_TYPED: '@@veau/ENTRANCE_ACCOUNT_NAME_TYPED' = '@@veau/ENTRANCE_ACCOUNT_NAME_TYPED';
export const ENTRANCE_PASSWORD_TYPED: '@@veau/ENTRANCE_PASSWORD_TYPED' = '@@veau/ENTRANCE_PASSWORD_TYPED';
export const ENTRANCE_UPDATE: '@@veau/ENTRANCE_UPDATE' = '@@veau/ENTRANCE_UPDATE';

export const STATS_LIST_INITIALIZE: '@@veau/STATS_LIST_INITIALIZE' = '@@veau/STATS_LIST_INITIALIZE';
export const STATS_LIST_OPEN_STATS_MODAL: '@@veau/STATS_LIST_OPEN_STATS_MODAL' = '@@veau/STATS_LIST_OPEN_STATS_MODAL';
export const STATS_LIST_CLOSE_STATS_MODAL: '@@veau/STATS_LIST_CLOSE_STATS_MODAL' =
  '@@veau/STATS_LIST_CLOSE_STATS_MODAL';
export const STATS_LIST_NAME_TYPED: '@@veau/STATS_LIST_NAME_TYPED' = '@@veau/STATS_LIST_NAME_TYPED';
export const STATS_LIST_UNIT_TYPED: '@@veau/STATS_LIST_UNIT_TYPED' = '@@veau/STATS_LIST_UNIT_TYPED';
export const STATS_LIST_ISO639_SELECTED: '@@veau/STATS_LIST_ISO639_SELECTED' = '@@veau/STATS_LIST_ISO639_SELECTED';
export const STATS_LIST_ISO3166_SELECTED: '@@veau/STATS_LIST_ISO3166_SELECTED' = '@@veau/STATS_LIST_ISO3166_SELECTED';
export const STATS_LIST_TERM_SELECTED: '@@veau/STATS_LIST_TERM_SELECTED' = '@@veau/STATS_LIST_TERM_SELECTED';
export const STATS_LIST_UPDATE_NEW_STATS: '@@veau/STATS_LIST_UPDATE_NEW_STATS' = '@@veau/STATS_LIST_UPDATE_NEW_STATS';
export const STATS_LIST_RESET_NEW_STATS: '@@veau/STATS_LIST_RESET_NEW_STATS' = '@@veau/STATS_LIST_RESET_NEW_STATS';
export const STATS_LIST_SAVE_NEW_STATS: '@@veau/STATS_LIST_SAVE_NEW_STATS' = '@@veau/STATS_LIST_SAVE_NEW_STATS';

export const STATS_EDIT_INITIALIZE: '@@veau/STATS_EDIT_INITIALIZE' = '@@veau/STATS_EDIT_INITIALIZE';
export const STATS_EDIT_INITIALIZATION_FAILURE: '@@veau/STATS_EDIT_INITIALIZATION_FAILURE' =
  '@@veau/STATS_EDIT_INITIALIZATION_FAILURE';
export const STATS_EDIT_NAME_TYPED: '@@veau/STATS_EDIT_NAME_TYPED' = '@@veau/STATS_EDIT_NAME_TYPED';
export const STATS_EDIT_UNIT_TYPED: '@@veau/STATS_EDIT_UNIT_TYPED' = '@@veau/STATS_EDIT_UNIT_TYPED';
export const STATS_EDIT_ISO639_SELECTED: '@@veau/STATS_EDIT_ISO639_SELECTED' = '@@veau/STATS_EDIT_ISO639_SELECTED';
export const STATS_EDIT_ISO3166_SELECTED: '@@veau/STATS_EDIT_ISO3166_SELECTED' = '@@veau/STATS_EDIT_ISO3166_SELECTED';
export const STATS_EDIT_ITEM_NAME_TYPED: '@@veau/STATS_EDIT_ITEM_NAME_TYPED' = '@@veau/STATS_EDIT_ITEM_NAME_TYPED';
export const STATS_EDIT_ITEM_SAVE: '@@veau/STATS_EDIT_ITEM_SAVE' = '@@veau/STATS_EDIT_ITEM_SAVE';
export const STATS_EDIT_SELECT_ITEM: '@@veau/STATS_EDIT_SELECT_ITEM' = '@@veau/STATS_EDIT_SELECT_ITEM';
export const STATS_EDIT_SELECTING_ITEM_NAME_TYPED: '@@veau/STATS_EDIT_SELECTING_ITEM_NAME_TYPED' =
  '@@veau/STATS_EDIT_SELECTING_ITEM_NAME_TYPED';
export const STATS_EDIT_UPDATE_SELECTING_ITEM: '@@veau/STATS_EDIT_UPDATE_SELECTING_ITEM' =
  '@@veau/STATS_EDIT_UPDATE_SELECTING_ITEM';
export const STATS_EDIT_REMOVE_SELECTING_ITEM: '@@veau/STATS_EDIT_REMOVE_SELECTING_ITEM' =
  '@@veau/STATS_EDIT_REMOVE_SELECTING_ITEM';
export const STATS_EDIT_CLEAR_SELECTING_ITEM: '@@veau/STATS_EDIT_CLEAR_SELECTING_ITEM' =
  '@@veau/STATS_EDIT_CLEAR_SELECTING_ITEM';
export const STATS_EDIT_START_DATE_DETERMINED: '@@veau/STATS_EDIT_START_DATE_DETERMINED' =
  '@@veau/STATS_EDIT_START_DATE_DETERMINED';
export const STATS_EDIT_INVALID_DATE_INPUT: '@@veau/STATS_EDIT_INVALID_DATE_INPUT' =
  '@@veau/STATS_EDIT_INVALID_DATE_INPUT';
export const STATS_EDIT_DATA_FILLED: '@@veau/STATS_EDIT_DATA_FILLED' = '@@veau/STATS_EDIT_DATA_FILLED';
export const STATS_EDIT_DATA_DELETED: '@@veau/STATS_EDIT_DATA_DELETED' = '@@veau/STATS_EDIT_DATA_DELETED';
export const STATS_EDIT_ROW_SELECTED: '@@veau/STATS_EDIT_ROW_SELECTED' = '@@veau/STATS_EDIT_ROW_SELECTED';
export const STATS_EDIT_ROW_MOVED: '@@veau/STATS_EDIT_ROW_MOVED' = '@@veau/STATS_EDIT_ROW_MOVED';
export const STATS_EDIT_INVALID_VALUE_INPUT: '@@veau/STATS_EDIT_INVALID_VALUE_INPUT' =
  '@@veau/STATS_EDIT_INVALID_VALUE_INPUT';
export const STATS_EDIT_SAVE_STATS: '@@veau/STATS_EDIT_SAVE_STATS' = '@@veau/STATS_EDIT_SAVE_STATS';

export const STATS_LIST_ITEM_UPDATE: '@@veau/STATS_LIST_ITEM_UPDATE' = '@@veau/STATS_LIST_ITEM_UPDATE';
export const STATS_LIST_ITEM_RESET: '@@veau/STATS_LIST_ITEM_RESET' = '@@veau/STATS_LIST_ITEM_RESET';
export const STATS_UPDATE: '@@veau/STATS_UPDATE' = '@@veau/STATS_UPDATE';
export const STATS_RESET: '@@veau/STATS_RESET' = '@@veau/STATS_RESET';
export const STATS_DISPLAY_UPDATE: '@@veau/STATS_DISPLAY_UPDATE' = '@@veau/STATS_DISPLAY_UPDATE';
export const STATS_DISPLAY_RESET: '@@veau/STATS_DISPLAY_RESET' = '@@veau/STATS_DISPLAY_RESET';
export const STATS_ITEM_UPDATE: '@@veau/STATS_ITEM_UPDATE' = '@@veau/STATS_ITEM_UPDATE';
export const STATS_ITEM_RESET: '@@veau/STATS_ITEM_RESET' = '@@veau/STATS_ITEM_RESET';

export interface ChangeAction extends LocationChangeAction, Action {
  readonly type: typeof LOCATION_CHANGE;
}

export interface CallHistoryAction extends CallHistoryMethodAction, Action {
  readonly type: typeof CALL_HISTORY_METHOD;
}

export interface NothingAction extends Action {
  readonly type: typeof NOTHING;
}

export interface OnLoadAction extends Action {
  readonly type: typeof ON_LOAD;
}

export interface ModalRaiseAction extends Action {
  readonly type: typeof MODAL_RAISE;
  readonly title: string;
  readonly description: string;
  readonly values?: Record<string, string>;
}

export interface ModalCloseAction extends Action {
  readonly type: typeof MODAL_CLOSE;
}

export interface NotificationAppearAction extends Action {
  readonly type: typeof NOTIFICATION_APPEAR;
  readonly kind: NotificationKind;
  readonly horizontal: NotificationHPosition;
  readonly vertical: NotificationVPosition;
  readonly message: string;
  readonly duration: number;
  readonly values?: Record<string, string>;
}

export interface NotificationDisappearAction extends Action {
  readonly type: typeof NOTIFICATION_DISAPPEAR;
}

export interface LoadingStartAction extends Action {
  readonly type: typeof LOADING_START;
}

export interface LoadingFinishAction extends Action {
  readonly type: typeof LOADING_FINISH;
}

export interface IdentityAuthenticateAction extends Action {
  readonly type: typeof IDENTITY_AUTHENTICATE;
}

export interface IdentityAuthenticatedAction extends Action {
  readonly type: typeof IDENTITY_AUTHENTICATED;
  readonly identity: Identity;
}

export interface IdentityInitializeAction extends Action {
  readonly type: typeof IDENTITY_INITIALIZE;
}

export interface IdentityIdentifiedAction extends Action {
  readonly type: typeof IDENTITY_IDENTIFIED;
}

export interface LogoutAction extends Action {
  readonly type: typeof LOGOUT;
}

export interface PushToStatsListAction extends Action {
  readonly type: typeof PUSH_TO_STATS_LIST;
}

export interface PushToStatsEditAction extends Action {
  readonly type: typeof PUSH_TO_STATS_EDIT;
  readonly statsID: StatsID;
}

export interface PushToEntranceAction extends Action {
  readonly type: typeof PUSH_TO_ENTRANCE;
}

export interface ProviderOpenAction extends Action {
  readonly type: typeof PROVIDER_OPEN;
}

export interface ProviderCloseAction extends Action {
  readonly type: typeof PROVIDER_CLOSE;
}

export interface LocaleDefinedAction extends Action {
  readonly type: typeof LOCALE_DEFINED;
  readonly locale: Locale;
}

export interface EntranceAccountNameTypedAction extends Action {
  readonly type: typeof ENTRANCE_ACCOUNT_NAME_TYPED;
  readonly account: AccountName;
}

export interface EntrancePasswordTypedAction extends Action {
  readonly type: typeof ENTRANCE_PASSWORD_TYPED;
  readonly password: Password;
}

export interface EntranceUpdateAction extends Action {
  readonly type: typeof ENTRANCE_UPDATE;
  readonly entranceInformation: EntranceInformation;
}

export interface StatsListInitializeAction extends Action {
  readonly type: typeof STATS_LIST_INITIALIZE;
}

export interface StatsListOpenNewStatsModalAction extends Action {
  readonly type: typeof STATS_LIST_OPEN_STATS_MODAL;
}

export interface StatsListCloseNewStatsModalAction extends Action {
  readonly type: typeof STATS_LIST_CLOSE_STATS_MODAL;
}

export interface StatsListNameTypedAction extends Action {
  readonly type: typeof STATS_LIST_NAME_TYPED;
  readonly name: StatsName;
}

export interface StatsListUnitTypedAction extends Action {
  readonly type: typeof STATS_LIST_UNIT_TYPED;
  readonly unit: StatsUnit;
}

export interface StatsListISO639SelectedAction extends Action {
  readonly type: typeof STATS_LIST_ISO639_SELECTED;
  readonly iso639: ISO639;
}

export interface StatsListISO3166SelectedAction extends Action {
  readonly type: typeof STATS_LIST_ISO3166_SELECTED;
  readonly iso3166: ISO3166;
}

export interface StatsListTermSelectedAction extends Action {
  readonly type: typeof STATS_LIST_TERM_SELECTED;
  readonly term: Term;
}

export interface StatsListUpdateNewStatsAction extends Action {
  readonly type: typeof STATS_LIST_UPDATE_NEW_STATS;
  readonly stats: StatsDisplay;
}

export interface StatsListResetNewStatsAction extends Action {
  readonly type: typeof STATS_LIST_RESET_NEW_STATS;
}

export interface StatsListSaveNewStatsAction extends Action {
  readonly type: typeof STATS_LIST_SAVE_NEW_STATS;
}

export interface StatsEditInitializeAction extends Action {
  readonly type: typeof STATS_EDIT_INITIALIZE;
  readonly statsID: StatsID;
}

export interface StatsEditInitializationDeadAction extends Action {
  readonly type: typeof STATS_EDIT_INITIALIZATION_FAILURE;
}

export interface StatsEditNameTypedAction extends Action {
  readonly type: typeof STATS_EDIT_NAME_TYPED;
  readonly name: StatsName;
}

export interface StatsEditUnitTypedAction extends Action {
  readonly type: typeof STATS_EDIT_UNIT_TYPED;
  readonly unit: StatsUnit;
}

export interface StatsEditISO639SelectedAction extends Action {
  readonly type: typeof STATS_EDIT_ISO639_SELECTED;
  readonly iso639: ISO639;
}

export interface StatsEditISO3166SelectedAction extends Action {
  readonly type: typeof STATS_EDIT_ISO3166_SELECTED;
  readonly iso3166: ISO3166;
}

export interface StatsEditItemNameTypedAction extends Action {
  readonly type: typeof STATS_EDIT_ITEM_NAME_TYPED;
  readonly name: StatsItemName;
}

export interface StatsEditItemSaveAction extends Action {
  readonly type: typeof STATS_EDIT_ITEM_SAVE;
}

export interface StatsEditSelectItemAction extends Action {
  readonly type: typeof STATS_EDIT_SELECT_ITEM;
  readonly statsItem: Heisenberg<StatsItem>;
  readonly row: Row;
}

export interface StatsEditSelectingItemNameTypedAction extends Action {
  readonly type: typeof STATS_EDIT_SELECTING_ITEM_NAME_TYPED;
  readonly name: StatsItemName;
}

export interface StatsEditUpdateSelectingItemAction extends Action {
  readonly type: typeof STATS_EDIT_UPDATE_SELECTING_ITEM;
  readonly statsItem: Heisenberg<StatsItem>;
}

export interface StatsEditRemoveSelectingItemAction extends Action {
  readonly type: typeof STATS_EDIT_REMOVE_SELECTING_ITEM;
  readonly statsItem: StatsItem;
}

export interface StatsEditClearSelectingItemAction extends Action {
  readonly type: typeof STATS_EDIT_CLEAR_SELECTING_ITEM;
}

export interface StatsEditStartDateDeterminedAction extends Action {
  readonly type: typeof STATS_EDIT_START_DATE_DETERMINED;
  readonly startDate: AsOf;
}

export interface StatsEditInvalidDateInputAction extends Action {
  readonly type: typeof STATS_EDIT_INVALID_DATE_INPUT;
}

export interface StatsEditDataFilledAction extends Action {
  readonly type: typeof STATS_EDIT_DATA_FILLED;
  readonly coordinate: Coordinate;
  readonly value: NumericalValue;
}

export interface StatsEditDataDeletedAction extends Action {
  readonly type: typeof STATS_EDIT_DATA_DELETED;
  readonly coordinate: Coordinate;
}

export interface StatsEditRowSelectedAction extends Action {
  readonly type: typeof STATS_EDIT_ROW_SELECTED;
  readonly row: Row;
}

export interface StatsEditRowMovedAction extends Action {
  readonly type: typeof STATS_EDIT_ROW_MOVED;
  readonly column: Column;
  readonly target: Column;
}

export interface StatsEditInvalidValueInputAction extends Action {
  readonly type: typeof STATS_EDIT_INVALID_VALUE_INPUT;
}

export interface StatsEditSaveStatsAction extends Action {
  readonly type: typeof STATS_EDIT_SAVE_STATS;
}

export interface StatsListItemUpdateAction extends Action {
  readonly type: typeof STATS_LIST_ITEM_UPDATE;
  readonly statsListItems: StatsListItems;
}

export interface StatsListItemResetAction extends Action {
  readonly type: typeof STATS_LIST_ITEM_RESET;
}

export interface StatsUpdateAction extends Action {
  readonly type: typeof STATS_UPDATE;
  readonly stats: Stats;
}

export interface StatsResetAction extends Action {
  readonly type: typeof STATS_RESET;
}

export interface StatsDisplayUpdateAction extends Action {
  readonly type: typeof STATS_DISPLAY_UPDATE;
  readonly stats: StatsDisplay;
}

export interface StatsDisplayResetAction extends Action {
  readonly type: typeof STATS_DISPLAY_RESET;
}

export interface StatsItemUpdateAction extends Action {
  readonly type: typeof STATS_ITEM_UPDATE;
  readonly statsItem: StatsItem;
}

export interface StatsItemResetAction extends Action {
  readonly type: typeof STATS_ITEM_RESET;
}

export type VeauAction =
  | ChangeAction
  | CallHistoryAction
  | NothingAction
  | OnLoadAction
  | ModalRaiseAction
  | ModalCloseAction
  | NotificationAppearAction
  | NotificationDisappearAction
  | LoadingStartAction
  | LoadingFinishAction
  | IdentityAuthenticateAction
  | IdentityAuthenticatedAction
  | IdentityInitializeAction
  | IdentityIdentifiedAction
  | LogoutAction
  | PushToStatsListAction
  | PushToStatsEditAction
  | PushToEntranceAction
  | ProviderOpenAction
  | ProviderCloseAction
  | LocaleDefinedAction
  | EntranceAccountNameTypedAction
  | EntrancePasswordTypedAction
  | EntranceUpdateAction
  | StatsListInitializeAction
  | StatsListOpenNewStatsModalAction
  | StatsListCloseNewStatsModalAction
  | StatsListNameTypedAction
  | StatsListUnitTypedAction
  | StatsListISO639SelectedAction
  | StatsListISO3166SelectedAction
  | StatsListTermSelectedAction
  | StatsListUpdateNewStatsAction
  | StatsListResetNewStatsAction
  | StatsListSaveNewStatsAction
  | StatsEditInitializeAction
  | StatsEditInitializationDeadAction
  | StatsEditNameTypedAction
  | StatsEditUnitTypedAction
  | StatsEditISO639SelectedAction
  | StatsEditISO3166SelectedAction
  | StatsEditItemNameTypedAction
  | StatsEditItemSaveAction
  | StatsEditSelectItemAction
  | StatsEditSelectingItemNameTypedAction
  | StatsEditUpdateSelectingItemAction
  | StatsEditRemoveSelectingItemAction
  | StatsEditClearSelectingItemAction
  | StatsEditStartDateDeterminedAction
  | StatsEditInvalidDateInputAction
  | StatsEditDataFilledAction
  | StatsEditDataDeletedAction
  | StatsEditRowSelectedAction
  | StatsEditRowMovedAction
  | StatsEditInvalidValueInputAction
  | StatsEditSaveStatsAction
  | StatsListItemUpdateAction
  | StatsListItemResetAction
  | StatsUpdateAction
  | StatsResetAction
  | StatsDisplayUpdateAction
  | StatsDisplayResetAction
  | StatsItemUpdateAction
  | StatsItemResetAction;
