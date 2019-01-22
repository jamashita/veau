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
      intl
    } = this.props;

    return (
      <Drawer
        anchor='left'
        open={open}
        variant='temporary'
        onClose={this.props.close}
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
            onClick={this.props.toStatsList}
          >
            <ListItemIcon>
              <Icon
                className='fa fa-list-alt'
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
            onClick={this.props.logout}
          >
            <ListItemIcon>
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

export const PageProvider: React.ComponentClass<Props, State> = injectIntl(PageProviderImpl);
