import { Button, Card, CardActions, CardContent, CardHeader, Icon } from '@material-ui/core';
import * as React from 'react';
import { injectIntl, WithIntlProps, WrappedComponentProps } from 'react-intl';
import { Props } from '../../containers/pages/Entrance';
import { TextField } from '../atoms/TextField';

type State = {
};

class EntranceImpl extends React.Component<Props & WrappedComponentProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & WrappedComponentProps>): boolean {
    const {
      entranceInformation,
      intl
    } = this.props;

    if (intl.locale !== nextProps.intl.locale) {
      return true;
    }
    if (entranceInformation.equals(nextProps.entranceInformation)) {
      return false;
    }

    return true;
  }

  public render(): React.ReactNode {
    const {
      entranceInformation,
      intl,
      accountTyped,
      passwordTyped,
      loginClicked
    } = this.props;

    return (
      <Card
        className='login-form'
        raised={true}
      >
        <CardHeader
          title={intl.formatMessage({
            id: 'VEAU'
          })}
          subheader={intl.formatMessage({
            id: 'VEAU_DESCRIPTION'
          })}
        />
        <CardContent>
          <TextField
            label={intl.formatMessage({
              id: 'ACCOUNT_NAME'
            })}
            value={entranceInformation.getAccount()}
            type='text'
            onKeyUp={accountTyped}
            onEnterUp={loginClicked}
          />
          <TextField
            label={intl.formatMessage({
              id: 'PASSWORD'
            })}
            value={entranceInformation.getPassword()}
            type='password'
            onKeyUp={passwordTyped}
            onEnterUp={loginClicked}
          />
        </CardContent>
        <CardActions>
          <Button
            variant='contained'
            color='primary'
            fullWidth={true}
            disabled={!entranceInformation.isAcceptable()}
            onClick={loginClicked}
          >
            <Icon
              className='fas fa-sign-in-alt icon-spacing'
            />
            {intl.formatMessage({
              id: 'LOGIN'
            })}
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export const Entrance: React.ComponentType<WithIntlProps<Props & WrappedComponentProps>> = injectIntl(EntranceImpl);
