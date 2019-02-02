import { Button, Divider, Drawer, Icon, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Props } from '../../containers/molecules/PageProvider';

type State = {
};

class PageProviderImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
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
          <Icon className='fas fa-times' />
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

export const PageProvider: React.ComponentClass<Props, State> = injectIntl(PageProviderImpl);
