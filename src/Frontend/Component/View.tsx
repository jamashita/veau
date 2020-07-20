import React from 'react';

import { LoadingIndicator } from '../Container/Molecule/LoadingIndicator';
import { Modal } from '../Container/Molecule/Modal';
import { Notification } from '../Container/Molecule/Notification';
import { Catalogue } from './Catalogue';

type Props = Readonly<{}>;
type State = Readonly<{}>;

export class View extends React.Component<Props, State> {
  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render(): React.ReactNode {
    return (
      <div>
        <Catalogue/>
        <Modal/>
        <Notification/>
        <LoadingIndicator/>
      </div>
    );
  }
}
