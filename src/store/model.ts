import { ModelInformation, DEFAULTE_MODEL_INFORMATION } from "../types";
import { Action } from "redux";

export const modelReducer = (state: ModelInformation = DEFAULTE_MODEL_INFORMATION, action: Action): ModelInformation => {
    switch (action.type) {
        default:
            return state;
    }
}