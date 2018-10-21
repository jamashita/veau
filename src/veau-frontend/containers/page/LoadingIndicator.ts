import {connect} from 'react-redux';
import {MapStateToProps} from 'react-redux';
import {State} from '../../../declarations/State';
import LoadingIndicator from '../../components/page/LoadingIndicator';

type StateProps = {
  loadingCount: number;
};
export type Props = StateProps;

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => {
  const {
    loadingCount
  } = state;

  return {
    loadingCount
  };
};

export default connect(mapStateToProps, null)(LoadingIndicator);
