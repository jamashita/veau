import {connect, MapDispatchToProps, MapStateToProps} from 'react-redux';
import {Dispatch} from 'redux';
import {Action} from '../../../declarations/Action';
import {State} from '../../../declarations/State';
import {Login} from '../../../veau-vo/Login';
import {Entrance as Component} from '../../components/entrance/Entrance';
import {accountTyped, login, passwordTyped} from '../../actions/EntranceAction';

type StateProps = {
  login: Login;
};
type DispatchProps = {
  accountTyped: (name: string) => void;
  passwordTyped: (password: string) => void;
  loginClicked: () => void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state) => {
  const {
    entrance: {
      login
    }
  } = state;

  return {
    login
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>) => {
  return {
    accountTyped: (account: string) => {
      dispatch(accountTyped(account));
    },
    passwordTyped: (password: string) => {
      dispatch(passwordTyped(password));
    },
    loginClicked: () => {
      dispatch(login());
    }
  };
};

export const Entrance = connect(mapStateToProps, mapDispatchToProps)(Component);
