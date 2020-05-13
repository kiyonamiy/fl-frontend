import { Space, DEFAULT_SPACE } from "../types";
import { SET_SPACE_ROUND, SpaceAction, SET_ANOMALY_SPACE } from "../actions";

export const spaceReducer = (state: Space = DEFAULT_SPACE, action: SpaceAction): Space => {
    switch (action.type) {
        case SET_ANOMALY_SPACE:
            return {...state, anomaly: action.payload.anomaly};
        default: 
            return state;
    }
}