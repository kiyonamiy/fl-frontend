import React, { useState } from 'react';
import { connect } from 'react-redux';
import { State, Parallel } from '../../types';

export interface ParallelProps {
  width: number,
  height: number,
  title: number,
  data: Parallel,
  metrics: string[]
};
function ParallelPaneBase(props: ParallelProps): JSX.Element {
  const [curMetrics, setcurMetrics] = useState(new Array(props.metrics.length).fill(true));
  
  return (  
    <div className='parallel-view'>
        
    </div>
  );
}

const mapStateToProps = (state: State) => ({
    layers: state.Model.layers
});
export const ParallelPane = connect(
  mapStateToProps,
  null
)(ParallelPaneBase);
