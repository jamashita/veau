import React from 'react';

import { PageProvider } from '../../Container/Molecule/PageProvider';
import { Header } from '../Molecule/Header';

export type StateProps = Readonly<{}>;
export type DispatchProps = Readonly<{
  menuClicked(): void;
}>;
export type OwnProps = Readonly<{}>;
type Props = StateProps & DispatchProps & OwnProps;
type State = Readonly<{}>;

export class Authenticated extends React.Component<Props, State> {
  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      children,
      menuClicked
    } = this.props;

    return (
      <div>
        <Header menuClicked={menuClicked} />
        <PageProvider />
        {children}
      </div>
    );
  }
}
