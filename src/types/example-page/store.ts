/************* action type ******************** */
export enum ActionType {
  INCREASE,
  DECREASE
}

/************** actions ********************/
export interface Action {
  type: ActionType;
}

export type IncreaseAction = Action;

export interface DecreaseAction extends Action {
  readonly number: number;
}

/************** state ********************/
export interface StoreState {
  readonly sum: number;
}

/************** dispatch ********************/
export interface StoreDispatch {
  inrease: () => void;
  decrease: (number: number) => void;
}
