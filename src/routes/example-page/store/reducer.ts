import { StoreState, Action, ActionType, DecreaseAction } from '../../../types/example-page/store';

const defaultState: StoreState = {
  sum: 0
};

export default (state: StoreState = defaultState, action: Action) => {
  switch (action.type) {
    case ActionType.INCREASE:
      return {
        ...state,
        sum: state.sum + 1
      };
    case ActionType.DECREASE:
      return {
        ...state,
        sum: state.sum - (action as DecreaseAction).number
      };
    default:
      return state;
  }
};
