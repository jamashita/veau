import { Reducer } from 'redux';
import { PageProvider } from '../../VO/PageProvider/PageProvider';
import { LOCATION_CHANGE, PROVIDER_CLOSE, PROVIDER_OPEN, VeauAction } from '../Action';

const initialState: PageProvider = PageProvider.close();

export const pageProvider: Reducer<PageProvider, VeauAction> = (
  state: PageProvider = initialState,
  action: VeauAction
) => {
  switch (action.type) {
    case LOCATION_CHANGE: {
      return PageProvider.close();
    }
    case PROVIDER_OPEN: {
      return PageProvider.open();
    }
    case PROVIDER_CLOSE: {
      return PageProvider.close();
    }
    default: {
      return state;
    }
  }
};
