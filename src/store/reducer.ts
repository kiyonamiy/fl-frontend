import { combineReducers } from 'redux';

import examplePageReducer from '../routes/example-page/store/reducer';

export default combineReducers({
  examplePage: examplePageReducer
});
