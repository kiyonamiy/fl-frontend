import { Space, DEFAULT_SPACE } from "../types";
import { SET_SPACE_ROUND, SpaceAction, SET_ANOMALY_SPACE, SET_CONTRIBUTION_SPACE, SET_CONCAT_SPACE, SET_ANOMALY_FILTER, SET_CONTRIBUTION_FILTER } from "../actions";

export const spaceReducer = (state: Space = DEFAULT_SPACE, action: SpaceAction): Space => {
    switch (action.type) {
        case SET_ANOMALY_SPACE:
            return {...state, anomaly: action.payload.anomaly};
        case SET_CONTRIBUTION_SPACE:
            return {...state, contribution: action.payload.contribution};
        case SET_CONCAT_SPACE:
            return {...state, concat: action.payload.concat};
        case SET_ANOMALY_FILTER:
            return {...state, anomalyFilter: action.payload.filter};
        case SET_CONTRIBUTION_FILTER:
            return {...state, contributionFilter: action.payload.filter};
        default: 
            return state;
    }
}