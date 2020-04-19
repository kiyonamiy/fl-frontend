import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { BEGIN_GET_PERFORMANCE, BeginGetPerformance, GET_PERFORMANCE, GetPerformance, GetPerformanceError, GET_PERFORMANCE_ERROR } from '../client';
import { Performance, RoundRes, ClientRes } from '../../types';


const getData = (performance: any): Performance => {
    let res = [];
    for(let r in performance){
      if(performance.hasOwnProperty(r)){
        let thisRound = performance[r];
        let round: RoundRes = {
          round: +r, 
          clients: []
        };
        for(let c in thisRound['train']){
          if(thisRound['train'].hasOwnProperty(c)){
            let client: ClientRes = {
              id: +c,
              round: +r,
              train: {
                accuracy: thisRound['train'][c].accuracy,
                loss: thisRound['train'][c].loss,
              },
              test: {
                accuracy: thisRound['test'][c].accuracy,
                loss: thisRound['test'][c].loss,
              }
            }
            round.clients.push(client);
          }
        }
        res.push(round);
      }
    }
    return res
  }

// worker saga
function* showPerformanceAsync(action: BeginGetPerformance) {
  try {
    const response = yield call(axios.get, `/performance/?round=${action.payload.round}&number=${action.payload.number}`);
    const performanceAction: GetPerformance = {
      type: GET_PERFORMANCE,
      payload: {
        performance: getData(response.data),
        test: response.data
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
