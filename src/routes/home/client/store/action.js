// actions
export const RECEIVE_PERFORMANCE = 'RECEIVE_PERFORMANCE';
export const FETCH_PERFORMANCE_ERROR = 'FETCH_PERFORMANCE_ERROR';
export const BEGIN_GET_PERFORMANCE = 'BEGIN_GET_PERFORMANCE';


// action creators
export function GET_PERFORMANCE(performance) {
  return { type: RECEIVE_PERFORMANCE, performance }
}

export function GET_PERFORMANCE_ERROR(error) {
  return { type: FETCH_PERFORMANCE_ERROR, error }
}

export function Begin_GET_PERFORMANCE() {
  return { type: BEGIN_GET_PERFORMANCE }
}
