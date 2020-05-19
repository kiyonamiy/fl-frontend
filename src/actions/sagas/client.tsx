import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  BEGIN_GET_PERFORMANCE,
  BeginGetPerformance,
  GET_PERFORMANCE,
  GetPerformance,
  GetPerformanceError,
  GET_PERFORMANCE_ERROR,
  SetLatestRound,
  SET_LATEST_ROUND,
  SetDisplayRound,
  SET_DISPLAY_ROUND
} from '../client';
import { Performance, RoundRes, ClientRes } from '../../types';

const getData = (performance: any): Performance => {
  let res = [];
  for (let r in performance) {
    if (performance.hasOwnProperty(r)) {
      let thisRound = performance[r];
      let round: RoundRes = {
        round: Number(r),
        clients: []
      };
      for (let c in thisRound['train']) {
        if (thisRound['train'].hasOwnProperty(c)) {
          let client: ClientRes = {
            id: Number(c),
            round: Number(r),
            train: {
              accuracy: thisRound['train'][c].accuracy,
              loss: thisRound['train'][c].loss
            },
            test: {
              accuracy: thisRound['test'][c].accuracy,
              loss: thisRound['test'][c].loss
            }
          };
          round.clients.push(client);
        }
      }
      res.push(round);
    }
  }
  return res;
};

// worker saga
function* showPerformanceAsync(action: BeginGetPerformance) {
  try {
    const response = yield call(
      axios.get,
      `/performance/?round=${action.payload.round}&number=${action.payload.number}`
    );
    const performance = getData(response.data);
    // 自动更新的时候，更改当前数据
    if (action.payload.auto) {
      const performanceAction: GetPerformance = {
        type: GET_PERFORMANCE,
        payload: {
          performance,
          test: response.data
        }
      };
      yield put(performanceAction);
    }
    // 轮询的时候，不断更新显示的 latest round（无数据，不更新）
    if (performance.length > 0) {
      const setLatestRound: SetLatestRound = {
        type: SET_LATEST_ROUND,
        payload: {
          latestRound: action.payload.round
        }
      };
      yield put(setLatestRound);
      // 自动更新的时候，修改 display round
      if (action.payload.auto) {
        const setDisplayRound: SetDisplayRound = {
          type: SET_DISPLAY_ROUND,
          payload: {
            displayRound: action.payload.round
          }
        };
        yield put(setDisplayRound);
      }
    }
  } catch (e) {
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
