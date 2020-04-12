import React from 'react';
import { LoadingIndicator } from '../containers/molecules/LoadingIndicator';
import { Modal } from '../containers/molecules/Modal';
import { Notification } from '../containers/molecules/Notification';
import { Catalogue } from './Catalogue';

type Props = Readonly<{
}>;
type State = Readonly<{
}>;

export class View extends React.Component<Props, State> {

  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <div>
        <Catalogue />
        <Modal />
        <Notification />
        <LoadingIndicator />
      </div>
    );
  }
}
