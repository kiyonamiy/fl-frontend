import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { GET_PERFORMANCE, GET_PERFORMANCE_ERROR, BEGIN_GET_PERFORMANCE } from './action';

// worker saga
function* showPerformanceAsync(action) {
  try {
    const response = yield call(axios.get, '/performance/?round=500&number=5');
    yield put(GET_PERFORMANCE(response.data));
  } catch(e) {
    yield put(GET_PERFORMANCE_ERROR(e));
  }
}

// wacther saga
function* watchGetPerformance() {
  yield takeLatest(BEGIN_GET_PERFORMANCE, showPerformanceAsync);
}

// root saga
export default function* rootSaga() {
  yield watchGetPerformance()
}
