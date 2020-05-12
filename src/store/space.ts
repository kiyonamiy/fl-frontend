import { Space, DEFAULTE_SPACE } from "../types";
import { Action } from "redux";

export const spaceReducer = (state: Space = DEFAULTE_SPACE, action: Action): Space => {
    switch (action.type) {
        default: 
            return state;
    }
}