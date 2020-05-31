import { ReduxAction } from "./redux-action";
import { Parallel, MetricValue, Heatmap } from "../types";

export type SpaceAction = (SetAnomalySpace | SetContributionSpace | SetConcatSpace
    | SetAnomalyFilter | SetContributionFilter | SetSpaceTopK | SetSpaceRound | SetSPaceHeatmap);

export const SET_ANOMALY_SPACE = 'SET_ANOMALY_SPACE';
export type SetAnomalySpace = ReduxAction<typeof SET_ANOMALY_SPACE, {
    anomaly: Parallel
}>;

export const SET_CONTRIBUTION_SPACE = 'SET_CONTRIBUTION_SPACE';
export type SetContributionSpace = ReduxAction<typeof SET_CONTRIBUTION_SPACE, {
    contribution: Parallel
}>;

export const SET_ANOMALY_FILTER = 'SET_ANOMALY_FILTER';
export type SetAnomalyFilter = ReduxAction<typeof SET_ANOMALY_FILTER, {
    filter: boolean[]
}>;

export const SET_CONTRIBUTION_FILTER = 'SET_CONTRIBUTION_FILTER';
export type SetContributionFilter = ReduxAction<typeof SET_CONTRIBUTION_FILTER, {
    filter: boolean[]
}>;

export const SET_CONCAT_SPACE = 'SET_CONCAT_SPACE';
export type SetConcatSpace = ReduxAction<typeof SET_CONCAT_SPACE, {
    concat: MetricValue[]
}>;

export const SET_SPACE_TOP_K = 'SET_SPACE_TOP_K';
export type SetSpaceTopK = ReduxAction<typeof SET_SPACE_TOP_K, {
    clients: number[]
}>;

export const SET_SPACE_ROUND = 'SET_SPACE_ROUND';
export type SetSpaceRound = ReduxAction<typeof SET_SPACE_ROUND, {
    round: number
}>;

export const SET_SPACE_HEATMAP = 'SET_SPACE_HEATMAP';
export type SetSPaceHeatmap = ReduxAction<typeof SET_SPACE_HEATMAP, {
    heatmap: Heatmap
}>;