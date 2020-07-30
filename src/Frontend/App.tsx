import { dom, library } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faCheck,
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faHourglass,
  faInfoCircle,
  faListAlt,
  faPlusCircle,
  faPlusSquare,
  faSave,
  faSignInAlt,
  faSignOutAlt,
  faTimes,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { Supplier } from '@jamashita/publikum-type';
import { createMuiTheme, MuiThemeProvider, Theme } from '@material-ui/core';
import { grey, lightGreen, pink } from '@material-ui/core/colors';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'reflect-metadata';
import { View } from './Component/View';
import { I18NProvider } from './Container/I18NProvider';
import { history } from './History';
import './Sass/style.scss';
import { store } from './Store';

library.add(faBars, faPlusCircle, faHourglass, faSave, faPlusSquare, faSignOutAlt, faCheck, faTrash, faSignInAlt, faTimes, faExclamationCircle, faExclamationTriangle, faInfoCircle, faCheckCircle, faListAlt);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
dom.i2svg();

const muiTheme: Theme = createMuiTheme({
  palette: {
    primary: {
      light: pink[100],
      main: pink[500],
      dark: pink[900],
      contrastText: grey[100]
    },
    secondary: {
      light: lightGreen[200],
      main: lightGreen[400],
      dark: lightGreen[800],
      contrastText: grey[100]
    }
  }
});

const app: Supplier<React.ReactElement> = () => {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <I18NProvider>
            <View />
          </I18NProvider>
        </ConnectedRouter>
      </Provider>
    </MuiThemeProvider>
  );
};

ReactDOM.render(app(), document.getElementById('app'));
