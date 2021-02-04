import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { State, Space, SpaceType } from '../../types';
import { createDispatchHandler, ActionHandler } from "../../actions/redux-action";
import { SpaceAction, SET_SPACE_ROUND, SET_MODEL_LAYERS, ModelAction } from '../../actions';

import './history.css';
import { HeatmapPane } from './heatmap';
import ModelInfo from '../model-info';

export interface HistoryProps extends ActionHandler<SpaceAction | ModelAction> {
  curRound: number,
  space: Space
};
function HistoryPaneBase(props: HistoryProps): JSX.Element {
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
      <div className='Frame HistoryView'></div>
    );
  else
    return (  
      <div className='Frame HistoryView'>
        <div className='model-div'>
          <ModelInfo />
        </div>
        <div className='history-div'>
          <HeatmapPane />
        </div>
      </div>
    );
}

const mapStateToProps = (state: State) => ({
  curRound: state.Space.round,
  space: state.Space
});
export const HistoryPane = connect(
  mapStateToProps,
  createDispatchHandler<SpaceAction | ModelAction>()
)(HistoryPaneBase);
