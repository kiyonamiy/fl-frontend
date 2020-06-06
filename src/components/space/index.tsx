import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { State, Space, SpaceType } from '../../types';
import { createDispatchHandler, ActionHandler } from "../../actions/redux-action";
import { SpaceAction, SET_SPACE_ROUND, SET_MODEL_LAYERS, ModelAction } from '../../actions';
import { ParallelPane } from './parallel';

import './space.css';
import { ProjectionPane } from './projection';
import { HeatmapPane } from './heatmap';
export interface SpaceProps extends ActionHandler<SpaceAction | ModelAction> {
  curRound: number,
  space: Space
};
function SpacePaneBase(props: SpaceProps): JSX.Element {
  useEffect(() => {
    props.handleAction({
      type: SET_MODEL_LAYERS,
      payload: {
        layers: ['dense']
      }
    });
  }, []);
  return (  
    <div className='Frame SpaceView'>
      <div className='space-up-div'>
        <ParallelPane 
          title='Contribution Space'
          id={SpaceType.Contribution}
          data={props.space.contribution}
          width={250}
          color='#69b3a2'
        />
        <ProjectionPane
          data={props.space.concat}
          anomalyFilter={props.space.anomalyFilter}
          contributionFilter={props.space.contributionFilter}
        />
        <ParallelPane 
          title='Anomaly Space'
          id={SpaceType.Anomaly}
          data={props.space.anomaly}
          width={140}
          color='#c96e32'
        />
      </div>
      
      <div className='space-down-div'>
        <HeatmapPane />
      </div>
    </div>
  );
}

const mapStateToProps = (state: State) => ({
  curRound: 10,
  space: state.Space
});
export const SpacePane = connect(
  mapStateToProps,
  createDispatchHandler<SpaceAction | ModelAction>()
)(SpacePaneBase);
