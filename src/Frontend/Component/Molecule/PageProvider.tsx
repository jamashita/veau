import { Button, Divider, Drawer, Icon, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { PageProvider as Provider } from '../../../VO/PageProvider/PageProvider';

export type StateProps = Readonly<{
  provider: Provider;
}>;
export type DispatchProps = Readonly<{
  close(): void;
  toStatsList(): void;
  logout(): void;
}>;
export type OwnProps = Readonly<{}>;
type Props = StateProps & DispatchProps & OwnProps;
type State = Readonly<{}>;

class PageProviderImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    // prettier-ignore
    const {
      provider
    } = this.props;

    if (provider.equals(nextProps.provider)) {
      return true;
    }

    return false;
  }

  public render(): React.ReactNode {
    // prettier-ignore
    const {
      provider,
      intl,
      close,
      toStatsList,
      logout
    } = this.props;

    return (
      <Drawer anchor='left' open={provider.get()} variant='temporary' onClose={close}>
        <Button variant='contained' color='primary' fullWidth={true} onClick={close}>
          <Icon className='fas fa-times'/>
        </Button>
        <Divider/>
        <List>
          <ListItem button={true} onClick={toStatsList}>
            <ListItemIcon>
              <Icon className='fas fa-list-alt'/>
            </ListItemIcon>
            <ListItemText>
              {intl.formatMessage({
                id: 'STATS_LIST'
              })}
            </ListItemText>
          </ListItem>
        </List>
        <Divider/>
        <List>
          <ListItem button={true} onClick={logout}>
            <ListItemIcon>
              <Icon className='fas fa-sign-out-alt'/>
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

export const PageProvider: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(
  PageProviderImpl
);
