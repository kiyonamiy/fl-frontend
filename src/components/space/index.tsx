import React from 'react';
import { connect } from 'react-redux';
import { State } from '../../types';
import { createDispatchHandler, ActionHandler } from "../../actions/redux-action";
import { SpaceAction, SET_SPACE_ROUND } from '../../actions';

export interface SpaceProps extends ActionHandler<SpaceAction> {
  curRound: number
};
function SpacePaneBase(props: SpaceProps): JSX.Element {
  return (  
    <div className='Frame SpaceView'>
        <button onClick={() => {
          props.handleAction({
            type: SET_SPACE_ROUND,
            payload:{
              round: 50
            }
          });
        }}>Test</button>
    </div>
  );
}

const mapStateToProps = (state: State) => ({
  curRound: 10
});
export const SpacePane = connect(
  mapStateToProps,
  createDispatchHandler<SpaceAction>()
)(SpacePaneBase);
