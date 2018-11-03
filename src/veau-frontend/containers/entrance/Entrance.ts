import {connect, MapDispatchToProps, MapStateToProps} from 'react-redux';
import {State} from '../../../declarations/State';
import {Entrance} from '../../components/entrance/Entrance';
import {Dispatch} from 'redux';
import {Action} from '../../../declarations/Action';
import {accountNameTyped, login, passwordTyped} from '../../actions/EntranceAction';
import {Login} from '../../../veau-domain/Login';

type StateProps = {
  login: Login;
}
type DispatchProps = {
  accountNameTyped: (name: string) => void;
  passwordTyped: (password: string) => void;
  loginClicked: () => void;
}
type OwnProps = {
}
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
    accountNameTyped: (name: string) => {
      dispatch(accountNameTyped(name));
    },
    passwordTyped: (password: string) => {
      dispatch(passwordTyped(password));
    },
    loginClicked: () => {
      dispatch(login());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Entrance);
