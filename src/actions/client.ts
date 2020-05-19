import { Performance } from '../types';
import { ReduxAction } from './redux-action';

export type ClientAction =
  | BeginGetPerformance
  | GetPerformance
  | GetPerformanceError
  | SetLatestRound
  | SetDisplayRound
  | SetAuto;

export const BEGIN_GET_PERFORMANCE = 'BEGIN_GET_PERFORMANCE';
export type BeginGetPerformance = ReduxAction<
  typeof BEGIN_GET_PERFORMANCE,
  {
    round: number;
    number: number;
    auto: boolean;
  }
>;

export const GET_PERFORMANCE = 'GET_PERFORMANCE';
export type GetPerformance = ReduxAction<
  typeof GET_PERFORMANCE,
  {
    performance: Performance;
    test: any;
  }
>;

export const GET_PERFORMANCE_ERROR = 'GET_PERFORMANCE_ERROR';
export type GetPerformanceError = ReduxAction<
  typeof GET_PERFORMANCE_ERROR,
  {
    error: object;
  }
>;

export const SET_LATEST_ROUND = 'SET_LATEST_ROUND';
export type SetLatestRound = ReduxAction<
  typeof SET_LATEST_ROUND,
  {
    latestRound: number;
  }
>;

export const SET_DISPLAY_ROUND = 'SET_DISPLAY_ROUND';
export type SetDisplayRound = ReduxAction<
  typeof SET_DISPLAY_ROUND,
  {
    displayRound: number;
  }
>;

export const SET_AUTO = 'SET_AUTO';
export type SetAuto = ReduxAction<
  typeof SET_AUTO,
  {
    auto: boolean;
  }
>;
