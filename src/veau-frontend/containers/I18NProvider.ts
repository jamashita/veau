import {connect} from 'react-redux';
import I18NProvider from '../components/I18NProvider';
import {MapStateToProps, } from 'react-redux';
import {State} from '../../declarations/State';

type StateProps = {
  locale: string;
};
export type Props = StateProps;

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => {
  const {
    identity: {
      locale
    }
  } = state;

  return {
    locale
  };
};

export default connect(mapStateToProps, null)(I18NProvider);
