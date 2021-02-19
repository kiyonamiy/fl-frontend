import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { State, Analysis, SpaceType } from '../../types';
import { createDispatchHandler, ActionHandler } from "../../actions/redux-action";
import { SpaceAction, SET_MODEL_LAYERS, ModelAction } from '../../actions';

import './analysis.css';
export interface AnalysisProps extends ActionHandler<SpaceAction | ModelAction> {
  curRound: number,
  space: Analysis
};
function SpacePaneBase(props: AnalysisProps): JSX.Element {
  useEffect(() => {
    props.handleAction({
      type: SET_MODEL_LAYERS,
      payload: {
        layers: ['dense']
      }
    });
  }, []);
  if (props.curRound < 0) 
    return (
      <div className='Frame SpaceView'></div>
    );
  else
    return (  
      <div className='Frame SpaceView'>
      </div>
    );
}

const mapStateToProps = (state: State) => ({
  curRound: state.Space.round,
  space: state.Space
});
export const SpacePane = connect(
  mapStateToProps,
  createDispatchHandler<SpaceAction | ModelAction>()
)(SpacePaneBase);
