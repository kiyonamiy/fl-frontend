import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducer';

import examplePageSagas from '../routes/example-page/store/saga';
import clientViewSagas from '../routes/home/client/store/saga'

const sagaMiddleware = createSagaMiddleware();

export default createStore(rootReducer, compose(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(examplePageSagas);
sagaMiddleware.run(clientViewSagas);

