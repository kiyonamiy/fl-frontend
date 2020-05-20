import { Performance } from '../types';
import { ReduxAction } from './redux-action';

export type ClientAction =
  | ScheduledUpdateLatestRoundAction
  | SetPerformanceAction
  | GetPerformanceErrorAction
  | SetLatestRoundAction
  | SetDisplayRoundAction
  | SetAutoAction
  | DisplayRoundInputChangeAction;

export const SCHEDULED_UPDATE_LATEST_ROUND = 'SCHEDULED_UPDATE_LATEST_ROUND';
export type ScheduledUpdateLatestRoundAction = ReduxAction<
  typeof SCHEDULED_UPDATE_LATEST_ROUND,
  {
    round: number;
    number?: number;
    auto: boolean;
  }
>;

export const SET_PERFORMANCE = 'SET_PERFORMANCE';
export type SetPerformanceAction = ReduxAction<
  typeof SET_PERFORMANCE,
  {
    performance: Performance;
    test: any;
  }
>;

export const GET_PERFORMANCE_ERROR = 'GET_PERFORMANCE_ERROR';
export type GetPerformanceErrorAction = ReduxAction<
  typeof GET_PERFORMANCE_ERROR,
  {
    error: object;
  }
>;

export const SET_LATEST_ROUND = 'SET_LATEST_ROUND';
export type SetLatestRoundAction = ReduxAction<
  typeof SET_LATEST_ROUND,
  {
    latestRound: number;
  }
>;

export const DISPLAY_ROUND_INPUT_CHANGE = 'DISPLAY_ROUND_INPUT_CHANGE';
export type DisplayRoundInputChangeAction = ReduxAction<
  typeof DISPLAY_ROUND_INPUT_CHANGE,
  {
    displayRound: number;
  }
>;

export const SET_DISPLAY_ROUND = 'SET_DISPLAY_ROUND';
export type SetDisplayRoundAction = ReduxAction<
  typeof SET_DISPLAY_ROUND,
  {
    displayRound: number;
  }
>;

export const SET_AUTO = 'SET_AUTO';
export type SetAutoAction = ReduxAction<
  typeof SET_AUTO,
  {
    auto: boolean;
  }
>;
