import { createStore, compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducer';

import examplePageSagas from '../routes/example-page/store/saga';
import clientViewSagas from '../routes/home/client/store/saga'

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
  });

export default createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(examplePageSagas);
sagaMiddleware.run(clientViewSagas);

