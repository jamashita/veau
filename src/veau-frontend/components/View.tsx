import * as React from 'react';
import { LoadingIndicator } from '../containers/molecules/LoadingIndicator';
import { Modal } from '../containers/molecules/Modal';
import { Catalogue } from './Catalogue';

type Props = {
};
type State = {
};

export class View extends React.Component<Props, State> {

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
