import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {addLocaleData} from 'react-intl';
import * as en from 'react-intl/locale-data/en';
import * as fr from 'react-intl/locale-data/fr';
import * as es from 'react-intl/locale-data/es';
import * as ja from 'react-intl/locale-data/ja';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import {MainView} from './components/MainView';
import {I18NProvider} from './containers/I18NProvider';
import {persistor, store} from './store';
import {history} from './history';
import {PersistGate} from 'redux-persist/integration/react';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {grey, lightGreen, pink} from '@material-ui/core/colors';

addLocaleData([...en, ...fr, ...es, ...ja]);

const muiTheme = createMuiTheme({
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
