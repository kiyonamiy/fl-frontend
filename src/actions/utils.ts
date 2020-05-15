import { ReduxAction } from "./redux-action";

export type UtilsAction = SetHighlightClient;

export const SET_HIGHLIGHT_CLIENT = 'SET_HIGHLIGHT_CLIENT';
export type SetHighlightClient = ReduxAction<typeof SET_HIGHLIGHT_CLIENT, {
    client: number
}>;
