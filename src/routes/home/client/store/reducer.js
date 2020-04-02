import {FETCH_PERFORMANCE_ERROR, RECEIVE_PERFORMANCE} from "./action";

let initialState = {
  fetched: false,
  performance: {},
  error: null
};

const clientReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_PERFORMANCE_ERROR: {
      return {...state, error: action.error};
    }
    case RECEIVE_PERFORMANCE: {
      return {...state, fetched: true, performance: action.performance};
    }
    default: {
      console.log('No action match.')
    }
  }
  return state;
};

export default clientReducer
