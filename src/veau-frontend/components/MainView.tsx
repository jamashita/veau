import * as React from 'react';
import Catalogue from './Catalogue';
import Modal from '../containers/page/Modal';
import LoadingIndicator from '../containers/page/LoadingIndicator';

type Props = {
}

export default class MainView extends React.Component<Props, {}> {

  public shouldComponentUpdate(nextProps: Props): boolean {
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
