/* eslint-disable @typescript-eslint/typedef */
import { Nullable } from '@jamashita/publikum-type';
import { CallHistoryMethodAction, LocationChangeAction } from 'connected-react-router';
import { Action } from 'redux';
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

export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE' as const;
export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD' as const;

export const NOTHING = '@@veau/NOTHING' as const;

export const ON_LOAD = '@@veau/ON_LOAD' as const;

export const MODAL_RAISE = '@@veau/MODAL_RAISE' as const;
export const MODAL_CLOSE = '@@veau/MODAL_CLOSE' as const;

export const NOTIFICATION_APPEAR = '@@veau/NOTIFICATION_APPEAR' as const;
export const NOTIFICATION_DISAPPEAR = '@@veau/NOTIFICATION_DISAPPEAR' as const;

export const LOADING_START = '@@veau/LOADING_START' as const;
export const LOADING_FINISH = '@@veau/LOADING_FINISH' as const;

export const IDENTITY_AUTHENTICATE = '@@veau/IDENTITY_AUTHENTICATE' as const;
export const IDENTITY_AUTHENTICATED = '@@veau/IDENTITY_AUTHENTICATED' as const;
export const IDENTITY_AUTHENTICATION_FAILED = '@@veau/IDENTITY_AUTHENTICATION_FAILED' as const;
export const IDENTITY_INITIALIZE = '@@veau/IDENTITY_INITIALIZE' as const;
export const IDENTITY_IDENTIFIED = '@@veau/IDENTITY_IDENTIFIED' as const;

export const LOGOUT = '@@veau/LOGOUT' as const;

export const PUSH_TO_STATS_LIST = '@@veau/PUSH_TO_STATS_LIST' as const;
export const PUSH_TO_STATS_EDIT = '@@veau/PUSH_TO_STATS_EDIT' as const;
export const PUSH_TO_ENTRANCE = '@@veau/PUSH_TO_ENTRANCE' as const;

export const PROVIDER_OPEN = '@@veau/PROVIDER_OPEN' as const;
export const PROVIDER_CLOSE = '@@veau/PROVIDER_CLOSE' as const;

export const LOCALE_DEFINED = '@@veau/LOCALE_DEFINED' as const;

export const ENTRANCE_ACCOUNT_NAME_TYPED = '@@veau/ENTRANCE_ACCOUNT_NAME_TYPED' as const;
export const ENTRANCE_PASSWORD_TYPED = '@@veau/ENTRANCE_PASSWORD_TYPED' as const;
export const ENTRANCE_UPDATE = '@@veau/ENTRANCE_UPDATE' as const;

export const STATS_LIST_INITIALIZE = '@@veau/STATS_LIST_INITIALIZE' as const;
export const STATS_LIST_OPEN_STATS_MODAL = '@@veau/STATS_LIST_OPEN_STATS_MODAL' as const;
export const STATS_LIST_CLOSE_STATS_MODAL = '@@veau/STATS_LIST_CLOSE_STATS_MODAL' as const;
export const STATS_LIST_NAME_TYPED = '@@veau/STATS_LIST_NAME_TYPED' as const;
export const STATS_LIST_UNIT_TYPED = '@@veau/STATS_LIST_UNIT_TYPED' as const;
export const STATS_LIST_ISO639_SELECTED = '@@veau/STATS_LIST_ISO639_SELECTED' as const;
export const STATS_LIST_ISO3166_SELECTED = '@@veau/STATS_LIST_ISO3166_SELECTED' as const;
export const STATS_LIST_TERM_SELECTED = '@@veau/STATS_LIST_TERM_SELECTED' as const;
export const STATS_LIST_UPDATE_STATS = '@@veau/STATS_LIST_UPDATE_STATS' as const;
export const STATS_LIST_RESET_STATS = '@@veau/STATS_LIST_RESET_STATS' as const;
export const STATS_LIST_UPDATE_STATS_ITEMS = '@@veau/STATS_LIST_UPDATE_STATS_ITEMS' as const;
export const STATS_LIST_RESET_STATS_ITEMS = '@@veau/STATS_LIST_RESET_STATS_ITEMS' as const;
export const STATS_LIST_SAVE_STATS = '@@veau/STATS_LIST_SAVE_STATS' as const;

export const STATS_EDIT_INITIALIZE = '@@veau/STATS_EDIT_INITIALIZE' as const;
export const STATS_EDIT_INITIALIZATION_FAILURE = '@@veau/STATS_EDIT_INITIALIZATION_FAILURE' as const;
export const STATS_EDIT_NAME_TYPED = '@@veau/STATS_EDIT_NAME_TYPED' as const;
export const STATS_EDIT_UNIT_TYPED = '@@veau/STATS_EDIT_UNIT_TYPED' as const;
export const STATS_EDIT_ISO639_SELECTED = '@@veau/STATS_EDIT_ISO639_SELECTED' as const;
export const STATS_EDIT_ISO3166_SELECTED = '@@veau/STATS_EDIT_ISO3166_SELECTED' as const;
export const STATS_EDIT_ITEM_NAME_TYPED = '@@veau/STATS_EDIT_ITEM_NAME_TYPED' as const;
export const STATS_EDIT_ITEM_SAVE = '@@veau/STATS_EDIT_ITEM_SAVE' as const;
export const STATS_EDIT_SELECT_ITEM = '@@veau/STATS_EDIT_SELECT_ITEM' as const;
export const STATS_EDIT_SELECTING_ITEM_NAME_TYPED = '@@veau/STATS_EDIT_SELECTING_ITEM_NAME_TYPED' as const;
export const STATS_EDIT_UPDATE_SELECTING_ITEM = '@@veau/STATS_EDIT_UPDATE_SELECTING_ITEM' as const;
export const STATS_EDIT_REMOVE_SELECTING_ITEM = '@@veau/STATS_EDIT_REMOVE_SELECTING_ITEM' as const;
export const STATS_EDIT_CLEAR_SELECTING_ITEM = '@@veau/STATS_EDIT_CLEAR_SELECTING_ITEM' as const;
export const STATS_EDIT_START_DATE_DETERMINED = '@@veau/STATS_EDIT_START_DATE_DETERMINED' as const;
export const STATS_EDIT_DATA_FILLED = '@@veau/STATS_EDIT_DATA_FILLED' as const;
export const STATS_EDIT_DATA_DELETED = '@@veau/STATS_EDIT_DATA_DELETED' as const;
export const STATS_EDIT_ROW_SELECTED = '@@veau/STATS_EDIT_ROW_SELECTED' as const;
export const STATS_EDIT_ROW_MOVED = '@@veau/STATS_EDIT_ROW_MOVED' as const;
export const STATS_EDIT_INVALID_DATE_INPUT = '@@veau/STATS_EDIT_INVALID_DATE_INPUT' as const;
export const STATS_EDIT_INVALID_VALUE_INPUT = '@@veau/STATS_EDIT_INVALID_VALUE_INPUT' as const;
export const STATS_EDIT_UPDATE_STATS = '@@veau/STATS_EDIT_UPDATE_STATS' as const;
export const STATS_EDIT_RESET_STATS = '@@veau/STATS_EDIT_RESET_STATS' as const;
export const STATS_EDIT_UPDATE_STATS_ITEM = '@@veau/STATS_EDIT_UPDATE_STATS_ITEM' as const;
export const STATS_EDIT_RESET_STATS_ITEM = '@@veau/STATS_EDIT_RESET_STATS_ITEM' as const;
export const STATS_EDIT_SAVE_STATS = '@@veau/STATS_EDIT_SAVE_STATS' as const;

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
  readonly values?: { [key: string]: string; };
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
  readonly values?: { [key: string]: string; };
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

export interface IdentityAuthenticationFailedAction extends Action {
  readonly type: typeof IDENTITY_AUTHENTICATION_FAILED;
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

export interface StatsListUpdateStatsAction extends Action {
  readonly type: typeof STATS_LIST_UPDATE_STATS;
  readonly stats: Stats;
}

export interface StatsListResetStatsAction extends Action {
  readonly type: typeof STATS_LIST_RESET_STATS;
}

export interface StatsListUpdateStatsItemsAction extends Action {
  readonly type: typeof STATS_LIST_UPDATE_STATS_ITEMS;
  readonly items: StatsListItems;
}

export interface StatsListResetStatsItemsAction extends Action {
  readonly type: typeof STATS_LIST_RESET_STATS_ITEMS;
}

export interface StatsListSaveStatsAction extends Action {
  readonly type: typeof STATS_LIST_SAVE_STATS;
}

export interface StatsEditInitializeAction extends Action {
  readonly type: typeof STATS_EDIT_INITIALIZE;
  readonly statsID: StatsID;
}

export interface StatsEditInitializationFailureAction extends Action {
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
  readonly item: Nullable<StatsItem>;
  readonly row: Row;
}

export interface StatsEditSelectingItemNameTypedAction extends Action {
  readonly type: typeof STATS_EDIT_SELECTING_ITEM_NAME_TYPED;
  readonly name: StatsItemName;
}

export interface StatsEditUpdateSelectingItemAction extends Action {
  readonly type: typeof STATS_EDIT_UPDATE_SELECTING_ITEM;
  readonly item: Nullable<StatsItem>;
}

export interface StatsEditRemoveSelectingItemAction extends Action {
  readonly type: typeof STATS_EDIT_REMOVE_SELECTING_ITEM;
  readonly item: StatsItem;
}

export interface StatsEditClearSelectingItemAction extends Action {
  readonly type: typeof STATS_EDIT_CLEAR_SELECTING_ITEM;
}

export interface StatsEditStartDateDeterminedAction extends Action {
  readonly type: typeof STATS_EDIT_START_DATE_DETERMINED;
  readonly startDate: AsOf;
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

export interface StatsEditInvalidDateInputAction extends Action {
  readonly type: typeof STATS_EDIT_INVALID_DATE_INPUT;
}

export interface StatsEditInvalidValueInputAction extends Action {
  readonly type: typeof STATS_EDIT_INVALID_VALUE_INPUT;
}

export interface StatsEditUpdateStatsAction extends Action {
  readonly type: typeof STATS_EDIT_UPDATE_STATS;
  readonly stats: Stats;
}

export interface StatsEditResetStatsAction extends Action {
  readonly type: typeof STATS_EDIT_RESET_STATS;
}


export interface StatsEditUpdateStatsItemAction extends Action {
  readonly type: typeof STATS_EDIT_UPDATE_STATS_ITEM;
  readonly item: StatsItem;
}

export interface StatsEditResetStatsItemAction extends Action {
  readonly type: typeof STATS_EDIT_RESET_STATS_ITEM;
}

export interface StatsEditSaveStatsAction extends Action {
  readonly type: typeof STATS_EDIT_SAVE_STATS;
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
  | IdentityAuthenticationFailedAction
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
  | StatsListUpdateStatsAction
  | StatsListResetStatsAction
  | StatsListUpdateStatsItemsAction
  | StatsListResetStatsItemsAction
  | StatsListSaveStatsAction
  | StatsEditInitializeAction
  | StatsEditInitializationFailureAction
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
  | StatsEditDataFilledAction
  | StatsEditDataDeletedAction
  | StatsEditRowSelectedAction
  | StatsEditRowMovedAction
  | StatsEditInvalidDateInputAction
  | StatsEditInvalidValueInputAction
  | StatsEditUpdateStatsAction
  | StatsEditResetStatsAction
  | StatsEditUpdateStatsItemAction
  | StatsEditResetStatsItemAction
  | StatsEditSaveStatsAction;
