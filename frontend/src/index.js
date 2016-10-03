import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

import { App } from 'components';
import getInitialStore from './redux/getInitialStore';

import 'normalize.css';

(async () => {
  const store = await getInitialStore();
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
})();
