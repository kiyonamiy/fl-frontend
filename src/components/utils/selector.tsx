import { State } from '../../types';

export const getLayers = (state: State) => state.Model.layers;
export const getClientNum = (state: State) => state.Model.clientNum;
export const getRound = (state: State) => 10;
export const getAnomaly = (state: State) => state.Space.anomaly;
export const getSpaceK = (state: State) => state.Space.K;
