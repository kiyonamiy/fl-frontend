import { call, put, all, takeLatest, select } from 'redux-saga/effects';
import { SET_SPACE_ROUND, SetSpaceRound, SET_ANOMALY_SPACE, SET_CONTRIBUTION_SPACE, SET_CONCAT_SPACE, SET_ANOMALY_FILTER, SetAnomalyFilter,  SET_SPACE_TOP_K, SetSpaceTopK } from '../space';
import { getGradient, getOneRoundMetrics } from '../../api';
import { getLayers, getClientNum, getSpaceRound, getAnomaly, getSpaceK, getAnomalyFilter } from '../../components/utils/selector';
import { Metric, DEFAULT_ANOMALY_METRICS, DEFAULT_CONTRIBUTION_METRICS, DEFAULT_ANOMALY_SCALE, DEFAULT_CONTRIBUTION_SCALE, MetricValue, ClientValue, Weight } from '../../types';
import { deepClone } from '../../components/utils/deepclone';
import { SetGradient, SET_GRADIENT } from '../gradient';
import { sum } from '../../components/utils/math';

const transferSpaceData = (spaceRes: any, metrics: string[], scale: number[][], clientNum: number): Metric => {
    const res: Metric = {
        metrics: metrics.concat(),
        scale: scale,
        value: new Array(clientNum).fill(0).map((v, index) => {return {
            id: index,
            vector: []
        }})
    };
    metrics.forEach((v, i) => {
        const data = spaceRes[i];
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                res.value[+key].vector.push(data[+key]);
            }
        }
    });
    return res;
}

const mergeVector = (anomalyData: Metric, contributionData: Metric): MetricValue[] => {
    const res = deepClone<MetricValue[]>(anomalyData.value);
    contributionData.value.forEach((d,i) => {
      res[i].vector.push(...d.vector);
    });
    return res;
};

const transferGradientData = (data: any, layers: string[]): Weight[] => {
    const res: Weight[] = [];
    for (let key in data) 
        if (data.hasOwnProperty(key)) {
            res.push({
                id: +key,
                vector: []
            });
            layers.forEach(layer => {
                res[res.length - 1].vector.push(...data[+key][layer]);
            });
    }
    return res;
};

function* requestSpace(action: SetSpaceRound): any {
    const layers: string[] = yield select(getLayers);
    const clientNum = yield select(getClientNum);
    const round = yield select(getSpaceRound);
    let spaceResult: any = yield call(getOneRoundMetrics, {round: round, layers: layers});
    spaceResult = spaceResult.data;
    const anomalyRes = transferSpaceData(spaceResult.slice(0, 6), DEFAULT_ANOMALY_METRICS, DEFAULT_ANOMALY_SCALE, clientNum);
    const anomalyAction = {
        type: SET_ANOMALY_SPACE,
        payload: {
            anomaly: anomalyRes
        }
    };
    yield put(anomalyAction);

    const contributionRes = transferSpaceData(spaceResult.slice(6, 10), DEFAULT_CONTRIBUTION_METRICS, DEFAULT_CONTRIBUTION_SCALE, clientNum);;
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

    const gradientRes = yield all ([
        call(getGradient, {round: Math.max(1, round - 1)}),
        call(getGradient, {round: round}),
        call(getGradient, {round: round, avg: true}),
    ]);
    const curWeidht: Weight[] = transferGradientData(gradientRes[1].data, layers);
    const preWeight: Weight[] = round > 0 ? 
        transferGradientData(gradientRes[0].data, layers)
        :
        curWeidht.map(v => ({
            id: v.id,
            vector: new Array(v.vector.length).fill(0)
        }));
    let avgWeight: number[] = [];
    const layersNum: number[] = [];
    layers.forEach(layer => {
        avgWeight = avgWeight.concat(gradientRes[2].data[layer]);
        layersNum.push(gradientRes[2].data[layer].length);
    });
    const gradientAction: SetGradient = {
        type: SET_GRADIENT,
        payload: {
            gradient: {
                curRound: curWeidht,
                preRound: preWeight,
                avgRound: avgWeight,
                layersNum: layersNum
            }
        }
    };
    yield put(gradientAction);

    // set filter auto
    yield requestMetrics({
        type: SET_ANOMALY_FILTER,
        payload: {
            filter: yield select(getAnomalyFilter)
        }
    });
}
// wacther saga
export function* watchSetSpaceRound() {
    yield takeLatest(SET_SPACE_ROUND, requestSpace)
  }

function* requestMetrics(action: SetAnomalyFilter): any {
    const anomaly: Metric = yield select(getAnomaly);
    const vector: ClientValue[] = anomaly.value.map(v => ({
        id: v.id,
        value: sum(v.vector.filter((v,i) => action.payload.filter[i]))
        })
    );
    vector.sort((a,b) => a.value - b.value);
    const k: number = yield select(getSpaceK);
    const clients = [];
    for (let index = 0; index < k; index++) {
        clients.push(vector[index].id);
    }
    const SpaceTopK: SetSpaceTopK = {
        type: SET_SPACE_TOP_K,
        payload: {
            clients: clients
        }
    };
    yield put(SpaceTopK);
}
export function* wacthMetricChange() {
    yield takeLatest(SET_ANOMALY_FILTER, requestMetrics);
}