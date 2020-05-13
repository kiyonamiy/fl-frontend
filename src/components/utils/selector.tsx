import { State } from '../../types';

export const getLayers = (state: State) => state.Model.layers;
export const getClientNum = (state: State) => state.Model.clientNum;