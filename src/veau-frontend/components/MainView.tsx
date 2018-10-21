import * as React from 'react';
import Catalogue from './Catalogue';
import Modal from '../containers/page/Modal';
import LoadingIndicator from '../containers/page/LoadingIndicator';

export default class MainView extends React.Component<{}, {}> {

  public shouldComponentUpdate(nextProps: {}, nextState: {}): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <div>
        <Catalogue />
        <Modal />
        <LoadingIndicator />
      </div>
    );
  }
}
