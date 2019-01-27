import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Icon } from '@material-ui/core';
import { pink } from '@material-ui/core/colors';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Brightness } from '../../Brightness';
import { Props } from '../../containers/pages/Entrance';
import { TextField } from '../atoms/TextField';

type State = {
};

class EntranceImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Readonly<Props & InjectedIntlProps>): boolean {
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
      intl
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
          avatar={<Avatar
            style={{
            backgroundColor: pink[Brightness.primaryMain]
            }}
          >Veau</Avatar>}
        />
        <CardContent>
          <TextField
            label={intl.formatMessage({
              id: 'ACCOUNT_NAME'
            })}
            value={entranceInformation.getAccount()}
            type='text'
            onKeyUp={this.props.accountTyped}
            onEnterUp={this.props.loginClicked}
          />
          <TextField
            label={intl.formatMessage({
              id: 'PASSWORD'
            })}
            value={entranceInformation.getPassword()}
            type='password'
            onKeyUp={this.props.passwordTyped}
            onEnterUp={this.props.loginClicked}
          />
        </CardContent>
        <CardActions>
          <Button
            variant='contained'
            color='primary'
            fullWidth={true}
            disabled={!entranceInformation.isAcceptable()}
            onClick={this.props.loginClicked}
          >
            <Icon className='fas fa-sign-in-alt icon-spacing' />
            {intl.formatMessage({
              id: 'LOGIN'
            })}
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export const Entrance: React.ComponentClass<Props, State> = injectIntl(EntranceImpl);
