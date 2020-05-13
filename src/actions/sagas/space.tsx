import { call, put, all, takeLatest, select } from 'redux-saga/effects';
import { SET_SPACE_ROUND, SetSpaceRound, SetAnomalySpace, SET_ANOMALY_SPACE, SetContributionSpace, SET_CONTRIBUTION_SPACE } from '../space';
import { getKrum, getFoolsGold, getZeno, getAuror, getSniper, getPca, getContributionGrad, getContributionPerformance } from '../../api';
import { getLayers, getClientNum } from '../../components/utils/selector';
import { Parallel, DEFAULT_ANOMALY_METRICS, DEFAULT_CONTRIBUTION_METRICS } from '../../types';

const transferData = (spaceRes: any, metrics: string[], clientNum: number): Parallel => {
    const res: Parallel = {
        metrics: metrics.concat(),
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
function* requestSpace(action:SetSpaceRound): any {
    const layers: string[] = yield select(getLayers);
    const clientNum = yield select(getClientNum);
    const spaceResult: any[] = yield all([
        call(getKrum, {layers: layers}),
        call(getFoolsGold, {layers: layers}),
        call(getZeno, {}),
        call(getAuror, {layers: layers}),
        call(getSniper, {layers: layers}),
        call(getPca, {layers: layers}),
        call(getContributionGrad, {}),
        call(getContributionGrad, {metric: 'cos'}),
        call(getContributionPerformance, {}),
        call(getContributionPerformance, {metric: 'loss'}),
    ]);
    const anomalyRes: Parallel = transferData(spaceResult.slice(0, 6), DEFAULT_ANOMALY_METRICS, clientNum);
    const contributionRes: Parallel = transferData(spaceResult.slice(6, 10), DEFAULT_CONTRIBUTION_METRICS, clientNum);;
    const anomalyAction: SetAnomalySpace = {
        type: SET_ANOMALY_SPACE,
        payload: {
            anomaly: anomalyRes
        }
    };
    yield put(anomalyAction);

    const contributionAction: SetContributionSpace = {
        type: SET_CONTRIBUTION_SPACE,
        payload: {
            contribution: contributionRes
        }
    };
    yield put(contributionAction);
}
// wacther saga
export function* watchSetSpaceRound() {
    yield takeLatest(SET_SPACE_ROUND, requestSpace)
  }