import { createMuiTheme, MuiThemeProvider, Theme } from '@material-ui/core';
import { grey, lightGreen, pink } from '@material-ui/core/colors';
import { ConnectedRouter } from 'connected-react-router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';
import * as en from 'react-intl/locale-data/en';
import * as es from 'react-intl/locale-data/es';
import * as fr from 'react-intl/locale-data/fr';
import * as ja from 'react-intl/locale-data/ja';
import { Provider } from 'react-redux';
import { View } from './components/View';
import { I18NProvider } from './containers/I18NProvider';
import { history } from './history';
import { store } from './store';

addLocaleData([
  ...en,
  ...es,
  ...fr,
  ...ja
]);

const muiTheme: Theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
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

ReactDOM.render(
  (
    <MuiThemeProvider theme={muiTheme}>
      <Provider store={store}>
        <I18NProvider>
          <ConnectedRouter history={history}>
            <View />
          </ConnectedRouter>
        </I18NProvider>
      </Provider>
    </MuiThemeProvider>
  ),
  document.getElementById('app')
);
