import { Button, Divider, Drawer, Icon, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';

import { PageProvider as Provider } from '../../../domain/vo/PageProvider/PageProvider';

export type StateProps = Readonly<{
  provider: Provider;
}>;
export type DispatchProps = Readonly<{
  close(): void;
  toStatsList(): void;
  logout(): void;
}>;
export type OwnProps = Readonly<{}>;
type Props = DispatchProps & OwnProps & StateProps;
type State = Readonly<{}>;

class PageProviderImpl extends React.Component<Props & WrappedComponentProps, State> {
  public shouldComponentUpdate(nextProps: Props & WrappedComponentProps): boolean {
    const {
      provider
    } = this.props;

    return !provider.equals(nextProps.provider);
  }

  public render(): React.ReactNode {
    const {
      provider,
      intl,
      close,
      toStatsList,
      logout
    } = this.props;

    return (
      <Drawer anchor="left" open={provider.get()} variant="temporary" onClose={close}>
        <Button variant="contained" color="primary" fullWidth={true} onClick={close}>
          <Icon className="fas fa-times" />
        </Button>
        <Divider />
        <List>
          <ListItem button={true} onClick={toStatsList}>
            <ListItemIcon>
              <Icon className="fas fa-list-alt" />
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
          <ListItem button={true} onClick={logout}>
            <ListItemIcon>
              <Icon className="fas fa-sign-out-alt" />
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

export const PageProvider: React.ComponentType<WithIntlProps<Props>> = injectIntl(
  PageProviderImpl
);
