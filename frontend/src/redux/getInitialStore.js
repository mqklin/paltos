import { createStore, applyMiddleware, compose } from 'redux';
import mainReducer from './reducers';
import thunk from 'redux-thunk';

async function getInitialStore() {
  return createStore(
    mainReducer,
    compose(
      applyMiddleware(thunk),
      process.env.NODE_ENV !== 'production' && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
}

export default getInitialStore;
