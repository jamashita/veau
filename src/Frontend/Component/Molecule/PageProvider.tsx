import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { Props } from '../../Container/molecules/PageProvider';

type State = Readonly<{}>;

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
