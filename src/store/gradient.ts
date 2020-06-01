import { Gradient, DEFAULT_GRADIENT } from "../types/gradient";
import { GradientAction, SET_GRADIENT } from "../actions";

export const gradientReducer = (state: Gradient = DEFAULT_GRADIENT, action: GradientAction): Gradient => {
    switch (action.type) {
        case SET_GRADIENT:
            return action.payload.gradient;
        default:
            return state;
    }
}