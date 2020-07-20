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
        <I18NProvider>
          <ConnectedRouter history={history}>
            <View/>
          </ConnectedRouter>
        </I18NProvider>
      </Provider>
    </MuiThemeProvider>
  );
};

ReactDOM.render(app(), document.getElementById('app'));
