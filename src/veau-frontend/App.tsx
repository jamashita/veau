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
import { PersistGate } from 'redux-persist/integration/react';
import { MainView } from './components/MainView';
import { I18NProvider } from './containers/I18NProvider';
import { history } from './history';
import { persistor, store } from './store';

addLocaleData([...en, ...fr, ...es, ...ja]);

const muiTheme: Theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      light: pink[300],
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
        <PersistGate persistor={persistor}>
          <I18NProvider>
            <ConnectedRouter history={history}>
              <MainView />
            </ConnectedRouter>
          </I18NProvider>
        </PersistGate>
      </Provider>
    </MuiThemeProvider>
  ),
  document.getElementById('app')
);
