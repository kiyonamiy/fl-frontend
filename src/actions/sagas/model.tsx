import { call, put, takeLatest, select } from 'redux-saga/effects';
import { SET_MODEL_LAYERS, SetModelLayers } from '../model';
import { getAllRoundMetrics } from '../../api';
import { Heatmap } from '../../types';
import { SetSPaceHeatmap, SET_SPACE_HEATMAP } from '../space';

function *resetHeatmap(): any {
    let allRes: any = yield call(getAllRoundMetrics, {});
    const data = allRes.data.res;
    const res: Heatmap = [];
    for (let key in data)
        if (data.hasOwnProperty(key)) {
            res.push({
                id: +key,
                anomaly: data[key]['anomaly'],
                contribution: data[key]['contribution']
            })
        }
    const heatmapAction: SetSPaceHeatmap = {
        type: SET_SPACE_HEATMAP,
        payload: {
            heatmap: res
        }
    };
    yield put(heatmapAction);
}

function* resetModelAsync(action: SetModelLayers) {
    yield resetHeatmap();
}

export function* watchSetLayers() {
    yield takeLatest(SET_MODEL_LAYERS, resetModelAsync);
}