import { connect, ConnectedComponent, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { AccountName } from '../../../VO/AccountName';
import { EntranceInformation } from '../../../VO/EntranceInformation';
import { Password } from '../../../VO/Password';
import { Action } from '../../Action/Action';
import { accountTyped, attemptLogin, passwordTyped } from '../../Action/EntranceAction';
import { Entrance as Component } from '../../Component/Page/Entrance';
import { State } from '../../State';

type StateProps = Readonly<{
  entranceInformation: EntranceInformation;
}>;
type DispatchProps = Readonly<{
  accountTyped: (name: AccountName) => void;
  passwordTyped: (password: Password) => void;
  loginClicked: () => void;
}>;
type OwnProps = Readonly<{}>;
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

export const Entrance: ConnectedComponent<typeof Component, Pick<StateProps, never>> = connect<StateProps, DispatchProps, OwnProps, State>(
  mapStateToProps,
  mapDispatchToProps
)(Component);
