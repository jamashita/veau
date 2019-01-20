import * as React from 'react';
import { LoadingIndicator } from '../containers/page/LoadingIndicator';
import { Modal } from '../containers/page/Modal';
import { Catalogue } from './Catalogue';

type Props = {
};
type State = {
};

export class MainView extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
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
