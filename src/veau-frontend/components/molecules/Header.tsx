import { AppBar, Icon, Toolbar } from '@material-ui/core';
import * as React from 'react';
import { I18NLabel } from '../atoms/I18NLabel';

type Props = {
  menuClicked: () => void;
};
type State = {
};

export class Header extends React.Component<Props, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      menuClicked
    } = this.props;

    return (
      <AppBar
        position='static'
        className='header'
      >
        <Toolbar
          variant='dense'
        >
          <Icon
            className='fas fa-bars icon-spacing'
            onClick={menuClicked}
          />
          <I18NLabel
            id='VEAU'
            color='inherit'
            variant='h5'
          />
        </Toolbar>
      </AppBar>
    );
  }
}
