import { AppBar, Icon, Toolbar, Typography } from '@material-ui/core';
import * as React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

type Props = {
  menuClicked: () => void;
};
type State = {
};

class HeaderImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(): boolean {
    return true;
  }

  public render(): React.ReactNode {
    const {
      intl,
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
          <Typography
            variant='h5'
            color='inherit'
          >
            {intl.formatMessage({
              id: 'VEAU'
            })}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export const Header: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(HeaderImpl);
