import { combineReducers } from 'redux';
import { clientReducer } from './client';
import { analysisReducer } from './space';
import { modelReducer } from './model';
import { State } from '../types';
import { utilsReducer } from './utils';
import { gradientReducer } from './gradient';

export default combineReducers<State>({
  Client: clientReducer,
  Space: analysisReducer,
  Model: modelReducer,
  Utils: utilsReducer,
  Gradient: gradientReducer
});
