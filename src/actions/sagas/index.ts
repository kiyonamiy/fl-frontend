import { all, fork } from 'redux-saga/effects';
import { watchGetPerformance } from './client';
import { watchSetSpaceRound } from './space';

export default function* root(): any {
  yield all([fork(watchGetPerformance), fork(watchSetSpaceRound)]);
};
