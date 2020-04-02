import { combineReducers } from 'redux';

import examplePageReducer from '../routes/example-page/store/reducer';
import clientViewReducer from '../routes/home/client/store/reducer';


export default combineReducers({
  examplePage: examplePageReducer,
  clientView: clientViewReducer
});
