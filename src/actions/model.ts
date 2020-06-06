import { ReduxAction } from './redux-action';

export type ModelAction = SetModelLayers;

export const SET_MODEL_LAYERS = 'SET_MODEL_LAYERS';
export type SetModelLayers = ReduxAction<typeof SET_MODEL_LAYERS, {
    layers: string[]
}>;