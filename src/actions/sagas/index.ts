import { all, fork } from 'redux-saga/effects';
import { watchGetPerformance } from './client';
import { watchSetSpaceRound, wacthMetricChange } from './space';
// import { watchSetLayers } from './model';

export default function* root(): any {
  yield all([
    fork(watchGetPerformance), 
    fork(watchSetSpaceRound), 
    fork(wacthMetricChange), 
    // fork(watchSetLayers)
  ]
  );
};
