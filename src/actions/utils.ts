import { ReduxAction } from "./redux-action";

export type UtilsAction = SetHighlightClient | SetHightlightRound;

export const SET_HIGHLIGHT_CLIENT = 'SET_HIGHLIGHT_CLIENT';
export type SetHighlightClient = ReduxAction<typeof SET_HIGHLIGHT_CLIENT, {
    client: number
}>;

export const SET_HIGHLIGHT_ROUND = 'SET_HIGHLIGHT_ROUND';
export type SetHightlightRound = ReduxAction<typeof SET_HIGHLIGHT_ROUND, {
    round: number
}>;