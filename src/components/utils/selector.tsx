import { State } from '../../types';

export const getAuto = (state: State) => state.Client.auto;
export const getLayers = (state: State) => state.Model.layers;
export const getClientNum = (state: State) => state.Model.clientNum;
export const getManuRound = (state: State) => state.Client.displayRound;
export const getSpaceRound = (state: State) => state.Space.round;
export const getEndRound = (state: State) => state.Client.latestRound;
export const getAnomaly = (state: State) => state.Space.anomaly;
export const getSpaceK = (state: State) => state.Space.K;
export const getAnomalyFilter = (state: State) => state.Space.anomalyFilter;
