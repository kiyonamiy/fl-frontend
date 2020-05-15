import React from 'react';
import { connect } from 'react-redux';
import { State, Space } from '../../types';
import { createDispatchHandler, ActionHandler } from "../../actions/redux-action";
import { SpaceAction, SET_SPACE_ROUND } from '../../actions';
import { ParallelPane } from './parallel';

import './space.css';
import { ProjectionPane } from './projection';
export interface SpaceProps extends ActionHandler<SpaceAction> {
  curRound: number,
  space: Space
};
function SpacePaneBase(props: SpaceProps): JSX.Element {
  return (  
    <div className='Frame SpaceView'>
        <button style={{    position: 'absolute',
    top: 700}} onClick={() => {
          props.handleAction({
            type: SET_SPACE_ROUND,
            payload:{
              round: 50
            }
          });
        }}>Test</button>
      <div className='space-up-div'>
        <ParallelPane 
          title='Contribution Space'
          id='contribution'
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
          id='anomaly'
          data={props.space.anomaly}
          width={120}
          color='#c96e32'
        />
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
  createDispatchHandler<SpaceAction>()
)(SpacePaneBase);
