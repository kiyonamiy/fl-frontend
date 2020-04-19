import {Client, DEFAULT_CLIENTS} from '../types'
import { ClientAction, GET_PERFORMANCE, GET_PERFORMANCE_ERROR } from "../actions";

export const clientReducer = (state: Client = DEFAULT_CLIENTS, action: ClientAction): Client => {
  switch(action.type) {
    case GET_PERFORMANCE_ERROR: {
      return {...state, error: action.payload.error};
    }
    case GET_PERFORMANCE: {
      return {...state, fetched: true, performance: action.payload.performance};
    }
    default: {
      console.log('No action match.')
    }
  }
  return state;
};

