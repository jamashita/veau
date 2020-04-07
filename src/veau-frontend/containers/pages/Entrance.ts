import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { AccountName } from '../../../veau-vo/AccountName';
import { EntranceInformation } from '../../../veau-vo/EntranceInformation';
import { Password } from '../../../veau-vo/Password';
import { Action } from '../../actions/Action';
import { accountTyped, attemptLogin, passwordTyped } from '../../actions/EntranceAction';
import { Entrance as Component } from '../../components/pages/Entrance';
import { State } from '../../State';

type StateProps = Readonly<{
  entranceInformation: EntranceInformation;
}>;

type DispatchProps = Readonly<{
  accountTyped: (name: AccountName) => void;
  passwordTyped: (password: Password) => void;
  loginClicked: () => void;
}>;

type OwnProps = Readonly<{
}>;

export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State) => {
  const {
    entranceInformation
  } = state;

  return {
    entranceInformation
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>) => {
  return {
    accountTyped: (account: AccountName) => {
      dispatch(accountTyped(account));
    },
    passwordTyped: (password: Password) => {
      dispatch(passwordTyped(password));
    },
    loginClicked: () => {
      dispatch(attemptLogin());
    }
  };
};

export const Entrance: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps, mapDispatchToProps)(Component);
