import { Utils, DEFAULT_UTILS } from '../types';
import { UtilsAction, SET_HIGHLIGHT_CLIENT } from '../actions/utils';

export const utilsReducer = (state: Utils = DEFAULT_UTILS, action: UtilsAction): Utils => {
    switch (action.type) {
        case SET_HIGHLIGHT_CLIENT:
            return {...state, preClient: state.client, client: action.payload.client};
        default:
            return state;
    }
}
