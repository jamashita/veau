import React from 'react';
import { PageProvider } from '../../Container/Molecule/PageProvider';
import { Props } from '../../Container/Template/Authenticated';
import { Header } from '../Molecule/Header';

type State = Readonly<{}>;

export class Authenticated extends React.Component<Props, State> {
  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render(): React.ReactNode {
    // prettier-ignore
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
