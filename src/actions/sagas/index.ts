import { all, fork } from 'redux-saga/effects';
import { watchGetPerformance } from './client';

export default function* root(): any {
  yield all([fork(watchGetPerformance)]);
};
