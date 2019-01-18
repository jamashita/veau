import {connect} from 'react-redux';
import {MapStateToProps} from 'react-redux';
import {State} from '../../declarations/State';
import {I18NProvider as Component} from '../components/I18NProvider';

type StateProps = {
  language: string;
};
type OwnProps = {
};
export type Props = StateProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state) => {
  const {
    identity: {
      language
    }
  } = state;

  return {
    language
  };
};

export const I18NProvider = connect(mapStateToProps, null)(Component);
