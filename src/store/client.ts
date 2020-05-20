import { Client, DEFAULT_CLIENTS } from '../types';
import {
  ClientAction,
  SET_PERFORMANCE,
  GET_PERFORMANCE_ERROR,
  SET_LATEST_ROUND,
  SET_DISPLAY_ROUND,
  SET_AUTO
} from '../actions';

export const clientReducer = (state: Client = DEFAULT_CLIENTS, action: ClientAction): Client => {
  switch (action.type) {
    case GET_PERFORMANCE_ERROR: {
      return { ...state, error: action.payload.error };
    }
    case SET_PERFORMANCE: {
      return {
        ...state,
        fetched: true,
        performance: action.payload.performance,
        test: action.payload.test
      };
    }
    case SET_LATEST_ROUND: {
      return {
        ...state,
        latestRound: action.payload.latestRound
      };
    }
    case SET_DISPLAY_ROUND: {
      return {
        ...state,
        displayRound: action.payload.displayRound
      };
    }
    case SET_AUTO: {
      return {
        ...state,
        auto: action.payload.auto
      };
    }
    default:
      return state;
  }
};
