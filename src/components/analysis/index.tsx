import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { State, Analysis, SpaceType } from '../../types';
import { createDispatchHandler, ActionHandler } from "../../actions/redux-action";
import { SpaceAction, SET_MODEL_LAYERS, ModelAction } from '../../actions';
import analysisSvg from '../../assets/icons/analysis.svg';

import './analysis.css';
export interface AnalysisProps extends ActionHandler<SpaceAction | ModelAction> {
  curRound: number,
  space: Analysis
};
function AnalysisPaneBase(props: AnalysisProps): JSX.Element {
  return (  
    <div className='Frame AnalysisView'>
      <div className='title'>
        <img src={analysisSvg} className='svg-class'></img>
        <p>ANOMALY-CONTRIBUTION ANALYSIS</p>
      </div>
    </div>
  );
}

const mapStateToProps = (state: State) => ({
  curRound: state.Space.round,
  space: state.Space
});
export const AnalysisPane = connect(
  mapStateToProps,
  createDispatchHandler<SpaceAction | ModelAction>()
)(AnalysisPaneBase);
