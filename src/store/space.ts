import { Analysis, DEFAULT_ANALYSIS } from "../types";
import { SpaceAction, SET_ANOMALY_SPACE, SET_CONTRIBUTION_SPACE, SET_CONCAT_SPACE, SET_ANOMALY_FILTER, SET_CONTRIBUTION_FILTER, SET_SPACE_TOP_K, SET_SPACE_ROUND, SET_LASSO_CLIENTS } from "../actions";

export const analysisReducer = (state: Analysis = DEFAULT_ANALYSIS, action: SpaceAction): Analysis => {
    switch (action.type) {
        case SET_SPACE_ROUND:
            return {...state, round: action.payload.round};
        case SET_ANOMALY_SPACE:
            return {...state, anomaly: action.payload.anomaly};
        case SET_CONTRIBUTION_SPACE:
            return {...state, contribution: action.payload.contribution};
        case SET_CONCAT_SPACE:
            return {...state, concat: action.payload.concat};
        case SET_ANOMALY_FILTER:
            return {...state, anomalyFilter: action.payload.filter};
        case SET_SPACE_TOP_K:
            return {...state, clients: action.payload.clients.concat(), savedClients: action.payload.clients.concat()};
        case SET_CONTRIBUTION_FILTER:
            return {...state, contributionFilter: action.payload.filter};
        case SET_LASSO_CLIENTS:
            return {
                ...state, 
                clients: action.payload.clients.length == 0 ? state.savedClients : action.payload.clients,
            };
        default: 
            return state;
    }
}