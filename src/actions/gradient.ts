import { ReduxAction } from "./redux-action";
import { Gradient } from "../types/gradient";

export type GradientAction = SetGradient;

export const SET_GRADIENT = 'SET_GRADEINT';
export type SetGradient = ReduxAction<typeof SET_GRADIENT, {
    gradient: Gradient
}>;
