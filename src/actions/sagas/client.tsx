import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { BEGIN_GET_PERFORMANCE, BeginGetPerformance, GET_PERFORMANCE, GetPerformance, GetPerformanceError, GET_PERFORMANCE_ERROR } from '../client';

// worker saga
function* showPerformanceAsync(action: BeginGetPerformance) {
  try {
    const response = yield call(axios.get, `/performance/?round=${action.payload.round}&number=${action.payload.number}`);
    const performanceAction: GetPerformance = {
      type: GET_PERFORMANCE,
      payload: {
        performance: response.data
      }
    };
    yield put(performanceAction);
  } catch(e) {
    const errorAction: GetPerformanceError = {
      type: GET_PERFORMANCE_ERROR,
      payload: {
        error: e
      }
    };
    yield put(errorAction);
  }
}

// wacther saga
export function* watchGetPerformance() {
  yield takeLatest(BEGIN_GET_PERFORMANCE, showPerformanceAsync);
}
