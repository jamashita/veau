import * as React from 'react';
import {injectIntl, InjectedIntlProps} from 'react-intl';
import {Props} from '../../containers/entrance/Entrance';
import Card from '@material-ui/core/Card/Card';
import CardHeader from '@material-ui/core/CardHeader/CardHeader';
import Avatar from '@material-ui/core/Avatar/Avatar';
import CardContent from '@material-ui/core/CardContent/CardContent';
import {TextField} from '../atoms/TextField';
import CardActions from '@material-ui/core/CardActions/CardActions';
import Button from '@material-ui/core/Button/Button';
import Icon from '@material-ui/core/Icon/Icon';
import {pink} from '@material-ui/core/colors';

type State = {
};

class EntranceImpl extends React.Component<Props & InjectedIntlProps, State> {

  public shouldComponentUpdate(nextProps: Props): boolean {
    const {
      login
    } = this.props;

    if (login.equals(nextProps.login)) {
      return false;
    }

    return true;
  }

  public render(): React.ReactNode {
    const {
      login,
      intl
    } = this.props;

    return (
      <Card className='login-form'>
        <CardHeader
          title={intl.formatMessage({
            id: 'VEAU'
          })}
          subheader={intl.formatMessage({
            id: 'VEAU_DESCRIPTION'
          })}
          avatar={<Avatar
            style={{
            backgroundColor: pink[500]
            }}
          >V</Avatar>}
        />
        <CardContent>
          <TextField
            label={intl.formatMessage({
              id: 'ACCOUNT_NAME'
            })}
            value={login.getName()}
            type='text'
            onKeyUp={this.props.accountNameTyped}
            onEnterUp={this.props.loginClicked}
          />
          <TextField
            label={intl.formatMessage({
              id: 'PASSWORD'
            })}
            value={login.getPassword()}
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
            disabled={!login.isAcceptable()}
            onClick={this.props.loginClicked}
          >
            <Icon className='fa fa-sign-in' />
            {intl.formatMessage({
              id: 'LOGIN'
            })}
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export const Entrance = injectIntl(EntranceImpl);
