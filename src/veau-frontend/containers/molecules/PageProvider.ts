import { connect, ConnectedComponentClass, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from '../../../declarations/Action';
import { State } from '../../../declarations/State';
import { logout } from '../../actions/LogoutAction';
import { closeProvider } from '../../actions/PageProviderAction';
import { PageProvider as Component } from '../../components/molecules/PageProvider';

type StateProps = {
  isOpen: boolean;
  language: string;
  locale: string;
};
type DispatchProps = {
  close(): void;
  logout(language: string, locale: string): void;
};
type OwnProps = {
};
export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state: State): StateProps => {
  const {
    pageProvider: {
      isOpen
    },
    identity: {
      language,
      locale
    }
  } = state;

  return {
    isOpen,
    language,
    locale
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    close: (): void => {
      dispatch(closeProvider());
    },
    logout: (language: string, locale: string): void => {
      dispatch(logout(language, locale));
    }
  };
};

export const PageProvider: ConnectedComponentClass<any, any> = connect(mapStateToProps, mapDispatchToProps)(Component);
