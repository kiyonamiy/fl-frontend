import { call, put, takeLatest, select } from 'redux-saga/effects';
import axios from 'axios';
import {
  SCHEDULED_UPDATE_LATEST_ROUND,
  ScheduledUpdateLatestRoundAction,
  SET_PERFORMANCE,
  SetPerformanceAction,
  GetPerformanceErrorAction,
  GET_PERFORMANCE_ERROR,
  SetLatestRoundAction,
  SET_LATEST_ROUND,
  SetDisplayRoundAction,
  SET_DISPLAY_ROUND,
  DisplayRoundInputChangeAction,
  DISPLAY_ROUND_INPUT_CHANGE
} from '../client';
import { Performance, RoundRes, ClientRes } from '../../types';
import { getSpaceRound, getAuto, getManuRound } from '../../components/utils/selector';
import { SET_SPACE_ROUND, SetSpaceRound } from '../space';

const DEFAULT_PERFORMANCE_NUMBER = 5;

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
function* scheduledUpdateLatestRoundAsync(action: ScheduledUpdateLatestRoundAction) {
  try {
    const response = yield call(
      axios.get,
      `/performance/?round=${action.payload.round}&number=${action.payload.number ||
        DEFAULT_PERFORMANCE_NUMBER}`
    );
    const performance = getData(response.data);
    // 自动更新的时候，更改当前数据
    if (action.payload.auto) {
      const setPerformanceAction: SetPerformanceAction = {
        type: SET_PERFORMANCE,
        payload: {
          performance,
          test: response.data
        }
      };
      yield put(setPerformanceAction);
    }
    // 轮询的时候，不断更新显示的 latest round（无数据，不更新）
    if (performance.length > 0) {
      const setLatestRound: SetLatestRoundAction = {
        type: SET_LATEST_ROUND,
        payload: {
          latestRound: action.payload.round
        }
      };
      yield put(setLatestRound);
      // 自动更新的时候，修改 display round
      if (action.payload.auto) {
        const setDisplayRound: SetDisplayRoundAction = {
          type: SET_DISPLAY_ROUND,
          payload: {
            displayRound: action.payload.round
          }
        };
        yield put(setDisplayRound);
      }
    }
  } catch (e) {
    const errorAction: GetPerformanceErrorAction = {
      type: GET_PERFORMANCE_ERROR,
      payload: {
        error: e
      }
    };
    yield put(errorAction);
  }
}

function* displayRoundInputChangeAsync(action: DisplayRoundInputChangeAction) {
  try {
    const response = yield call(
      axios.get,
      `/performance/?round=${action.payload.displayRound}&number=${DEFAULT_PERFORMANCE_NUMBER}`
    );
    const performance = getData(response.data);
    const setPerformanceAction: SetPerformanceAction = {
      type: SET_PERFORMANCE,
      payload: {
        performance,
        test: response.data
      }
    };
    yield put(setPerformanceAction);

    const setDisplayRound: SetDisplayRoundAction = {
      type: SET_DISPLAY_ROUND,
      payload: {
        displayRound: action.payload.displayRound
      }
    };
    yield put(setDisplayRound);
  } catch (e) {
    const errorAction: GetPerformanceErrorAction = {
      type: GET_PERFORMANCE_ERROR,
      payload: {
        error: e
      }
    };
    yield put(errorAction);
  }
  const auto = yield select(getAuto);
  const manuRound = yield select(getManuRound);
  const spaceRound = yield select(getSpaceRound);
  if (auto === false && manuRound != spaceRound) {
    const spaceRoundAction: SetSpaceRound = {
      type: SET_SPACE_ROUND,
      payload: {
        round: manuRound
      }
    };
    yield put(spaceRoundAction);
  }
}

// wacther saga
export function* watchGetPerformance() {
  yield takeLatest(SCHEDULED_UPDATE_LATEST_ROUND, scheduledUpdateLatestRoundAsync);
  yield takeLatest(DISPLAY_ROUND_INPUT_CHANGE, displayRoundInputChangeAsync);
}
