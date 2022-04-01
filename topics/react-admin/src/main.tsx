import React from 'react';
import ReactDOM from 'react-dom';
import localStorageDataProvider from 'ra-data-local-storage';
import { Admin, Resource } from 'react-admin';
import authors from './authors';
import posts from './posts';
import { Dashboard } from './components/Dashboard';
import { authProvider } from './lib/react-admin/authProvider';
import { createTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import 'src/style/index.css';
import { getI18nProvider } from './lib/react-admin/i18n';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: blue[500],
    },
    secondary: {
      main: blue[100],
    },
  },
});

// https://marmelab.com/react-admin/doc/3.4/Authentication.html#sending-credentials-to-the-api
const dataProvider = localStorageDataProvider();

ReactDOM.render(
  <React.StrictMode>
    <Admin
      locale="uk"
      i18nProvider={getI18nProvider()}
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
      theme={theme}
      disableTelemetry
    >
      <Resource {...posts} />
      <Resource {...authors} />
    </Admin>
  </React.StrictMode>,
  document.getElementById('root'),
);
