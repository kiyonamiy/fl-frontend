import { call, put, all, takeLatest, select } from 'redux-saga/effects';
import { SET_SPACE_ROUND, SetSpaceRound, SetAnomalySpace, SET_ANOMALY_SPACE, SetContributionSpace, SET_CONTRIBUTION_SPACE, SET_CONCAT_SPACE } from '../space';
import { getKrum, getFoolsGold, getZeno, getAuror, getSniper, getPca, getContributionGrad, getContributionPerformance } from '../../api';
import { getLayers, getClientNum, getRound } from '../../components/utils/selector';
import { Parallel, DEFAULT_ANOMALY_METRICS, DEFAULT_CONTRIBUTION_METRICS, DEFAULT_ANOMALY_SCALE, DEFAULT_CONTRIBUTION_SCALE, MetricValue } from '../../types';
import { deepClone } from '../../components/utils/deepclone';

const transferData = (spaceRes: any, metrics: string[], scale: number[][], clientNum: number): Parallel => {
    const res: Parallel = {
        metrics: metrics.concat(),
        scale: scale,
        value: new Array(clientNum).fill(0).map((v, index) => {return {
            id: index,
            vector: []
        }})
    };
    metrics.forEach((v, i) => {
        const data = spaceRes[i].data.data;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                res.value[+key].vector.push(data[+key]);
            }
        }
    });
    return res;
}

const mergeVector = (anomalyData: Parallel, contributionData: Parallel): MetricValue[] => {
    const res = deepClone<MetricValue[]>(anomalyData.value);
    contributionData.value.forEach((d,i) => {
      res[i].vector.push(...d.vector);
    });
    return res;
};
function* requestSpace(action: SetSpaceRound): any {
    const layers: string[] = yield select(getLayers);
    const clientNum = yield select(getClientNum);
    const round = yield select(getRound);
    const spaceResult: any[] = yield all([
        call(getKrum, {layers: layers, round: round}),
        call(getFoolsGold, {layers: layers, round: round}),
        call(getZeno, {round: round}),
        call(getAuror, {layers: layers, round: round}),
        call(getSniper, {layers: layers, round: round}),
        call(getPca, {layers: layers, round: round}),
        call(getContributionGrad, {round: round}),
        call(getContributionGrad, {metric: 'cos', round: round}),
        call(getContributionPerformance, {round: round}),
        call(getContributionPerformance, {metric: 'loss', round: round}),
    ]);
    const anomalyRes = transferData(spaceResult.slice(0, 6), DEFAULT_ANOMALY_METRICS, DEFAULT_ANOMALY_SCALE, clientNum);
    const anomalyAction = {
        type: SET_ANOMALY_SPACE,
        payload: {
            anomaly: anomalyRes
        }
    };
    yield put(anomalyAction);

    const contributionRes = transferData(spaceResult.slice(6, 10), DEFAULT_CONTRIBUTION_METRICS, DEFAULT_CONTRIBUTION_SCALE, clientNum);;
    const contributionAction = {
        type: SET_CONTRIBUTION_SPACE,
        payload: {
            contribution: contributionRes
        }
    };
    yield put(contributionAction);

    const concatRes = mergeVector(anomalyRes, contributionRes);
    const concatAction = {
      type: SET_CONCAT_SPACE,
      payload: {
        concat: concatRes
      }
    };
    yield put(concatAction);
}
// wacther saga
export function* watchSetSpaceRound() {
    yield takeLatest(SET_SPACE_ROUND, requestSpace)
  }