import { ReduxAction } from "./redux-action";
import { Parallel } from "../types";

export type SpaceAction = SetAnomalySpace | SetContributionSpace | SetSpaceRound;

export const SET_ANOMALY_SPACE = 'SET_ANOMALY_SPACE';
export type SetAnomalySpace = ReduxAction<typeof SET_ANOMALY_SPACE, {
    anomaly: Parallel
}>;

export const SET_CONTRIBUTION_SPACE = 'SET_CONTRIBUTION_SPACE';
export type SetContributionSpace = ReduxAction<typeof SET_CONTRIBUTION_SPACE, {
    contribution: Parallel
}>;

export const SET_SPACE_ROUND = 'SET_SPACE_ROUND';
export type SetSpaceRound = ReduxAction<typeof SET_SPACE_ROUND, {
    round: number
}>;
