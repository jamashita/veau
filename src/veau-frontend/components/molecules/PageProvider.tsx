import { Button, Divider, Drawer, Icon, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Props } from '../../containers/molecules/PageProvider';

type State = {
};

class PageProviderImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
    const {
      isOpen
    } = this.props;

    if (isOpen !== nextProps.isOpen) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      isOpen,
      intl
    } = this.props;

    return (
      <Drawer
        anchor='left'
        open={isOpen}
        variant='persistent'
      >
        <Button
          variant='contained'
          color='primary'
          fullWidth={true}
          onClick={this.props.close}
        >
          <Icon className='fa fa-times' />
        </Button>
        <Divider />
        <List>
          <ListItem
            button={true}
            onClick={this.props.logout}
          >
            <ListItemIcon
            >
              <Icon
                className='fa fa-sign-out'
              />
            </ListItemIcon>
            <ListItemText>
              {intl.formatMessage({
                id: 'LOGOUT'
              })}
            </ListItemText>
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

export const PageProvider: React.ComponentClass = injectIntl(PageProviderImpl);
