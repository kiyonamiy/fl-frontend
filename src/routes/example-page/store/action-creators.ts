import { IncreaseAction, ActionType, DecreaseAction } from '../../../types/example-page/store';

export function getIncreaseAction(): IncreaseAction {
  return {
    type: ActionType.INCREASE
  };
}

export function getDecreaseAction(number: number): DecreaseAction {
  return {
    type: ActionType.DECREASE,
    number
  };
}
