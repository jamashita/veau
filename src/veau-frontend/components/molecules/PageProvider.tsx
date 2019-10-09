import { Button, Divider, Drawer, Icon, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { Props } from '../../containers/molecules/PageProvider';

type State = {
};

class PageProviderImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>): boolean {
    const {
      open
    } = this.props;

    if (open !== nextProps.open) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    const {
      open,
      intl,
      close,
      toStatsList,
      logout
    } = this.props;

    return (
      <Drawer
        anchor='left'
        open={open}
        variant='temporary'
        onClose={close}
      >
        <Button
          variant='contained'
          color='primary'
          fullWidth={true}
          onClick={close}
        >
          <Icon
            className='fas fa-times'
          />
        </Button>
        <Divider />
        <List>
          <ListItem
            button={true}
            onClick={toStatsList}
          >
            <ListItemIcon>
              <Icon
                className='fas fa-list-alt'
              />
            </ListItemIcon>
            <ListItemText>
              {intl.formatMessage({
                id: 'STATS_LIST'
              })}
            </ListItemText>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button={true}
            onClick={logout}
          >
            <ListItemIcon>
              <Icon
                className='fas fa-sign-out-alt'
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

export const PageProvider: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(PageProviderImpl);
