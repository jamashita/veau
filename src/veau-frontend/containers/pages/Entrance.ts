import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { AccountName } from '../../../veau-vo/AccountName';
import { EntranceInformation } from '../../../veau-vo/EntranceInformation';
import { Password } from '../../../veau-vo/Password';
import { Action } from '../../actions/Action';
import { accountTyped, attemptLogin, passwordTyped } from '../../actions/EntranceAction';
import { Entrance as Component } from '../../components/pages/Entrance';
import { State } from '../../State';

type StateProps = {
  entranceInformation: EntranceInformation;
};
type DispatchProps = {
  accountTyped: (name: AccountName) => void;
  passwordTyped: (password: Password) => void;
  loginClicked: () => void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    entranceInformation
  } = state;

  return {
    entranceInformation
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    accountTyped: (account: AccountName): void => {
      dispatch(accountTyped(account));
    },
    passwordTyped: (password: Password): void => {
      dispatch(passwordTyped(password));
    },
    loginClicked: (): void => {
      dispatch(attemptLogin());
    }
  };
};

export const Entrance: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(mapStateToProps, mapDispatchToProps)(Component);
