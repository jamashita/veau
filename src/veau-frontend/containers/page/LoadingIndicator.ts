import {connect} from 'react-redux';
import {MapStateToProps} from 'react-redux';
import {State} from '../../../declarations/State';
import {LoadingIndicator as Component} from '../../components/page/LoadingIndicator';

type StateProps = {
  loadingCount: number;
};
export type Props = StateProps;
type OwnProps = {
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state) => {
  const {
    loadingCount
  } = state;

  return {
    loadingCount
  };
};

export const LoadingIndicator = connect(mapStateToProps, null)(Component);
