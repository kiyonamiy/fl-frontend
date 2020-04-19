import { combineReducers } from 'redux';
import { clientReducer } from './client';
import { State } from '../types';

export default combineReducers<State>({
  Client: clientReducer
})