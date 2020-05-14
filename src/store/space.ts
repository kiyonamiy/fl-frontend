import { Space, DEFAULT_SPACE } from "../types";
import { SET_SPACE_ROUND, SpaceAction, SET_ANOMALY_SPACE, SET_CONTRIBUTION_SPACE } from "../actions";

export const spaceReducer = (state: Space = DEFAULT_SPACE, action: SpaceAction): Space => {
    switch (action.type) {
        case SET_ANOMALY_SPACE:
            return {...state, anomaly: action.payload.anomaly};
        case SET_CONTRIBUTION_SPACE:
            return {...state, contribution: action.payload.contribution};
        default: 
            return state;
    }
}