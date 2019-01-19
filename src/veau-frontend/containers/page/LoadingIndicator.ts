import {connect, MapStateToProps} from 'react-redux';
import {State} from '../../../declarations/State';
import {LoadingIndicator as Component} from '../../components/page/LoadingIndicator';

type StateProps = {
  loadingCount: number;
};
type OwnProps = {
};
export type Props = StateProps & OwnProps;

const mapStateToProps: MapStateToProps<StateProps, OwnProps, State> = (state) => {
  const {
    loadingCount
  } = state;

  return {
    loadingCount
  };
};

export const LoadingIndicator = connect(mapStateToProps, null)(Component);
