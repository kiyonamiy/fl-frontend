import { Performance } from "../types";
import { ReduxAction } from "./redux-action";

export type ClientAction = BeginGetPerformance | GetPerformance | GetPerformanceError;

export const BEGIN_GET_PERFORMANCE = 'BEGIN_GET_PERFORMANCE';
export type BeginGetPerformance = ReduxAction<typeof BEGIN_GET_PERFORMANCE, {
  round: number,
  number: number
}>;

export const GET_PERFORMANCE = 'GET_PERFORMANCE';
export type GetPerformance = ReduxAction<typeof GET_PERFORMANCE, {
  performance: Performance,
  test: any
}>;

export const GET_PERFORMANCE_ERROR = 'GET_PERFORMANCE_ERROR';
export type GetPerformanceError = ReduxAction<typeof GET_PERFORMANCE_ERROR, {
  error: object
}>; 

