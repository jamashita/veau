import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';

import { AccountName } from '../../../VO/Account/AccountName';
import { Password } from '../../../VO/EntranceInformation/Password';
import { VeauAction } from '../../Action';
import { accountTyped, attemptLogin, passwordTyped } from '../../Action/EntranceAction';
import {
    DispatchProps, Entrance as Component, OwnProps, StateProps
} from '../../Component/Page/Entrance';
import { State } from '../../State';

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
  // prettier-ignore
  const {
    entranceInformation
  } = state;

  return {
    entranceInformation
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<VeauAction>) => {
  return {
    accountTyped(account: AccountName): void {
      dispatch(accountTyped(account));
    },
    passwordTyped(password: Password): void {
      dispatch(passwordTyped(password));
    },
    loginClicked(): void {
      dispatch(attemptLogin());
    }
  };
};

export const Entrance: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  State
>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
