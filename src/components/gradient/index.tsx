import React from 'react';
import { connect } from 'react-redux';
import { ActionHandler, createDispatchHandler } from '../../actions/redux-action';
import { UtilsAction } from '../../actions';
import { Gradient, State, Weight } from '../../types';
import { LineChartPane } from './lineChart';
import './gradient.css';

export interface GradientProps extends ActionHandler<UtilsAction> {
    gradient: Gradient,
    layers: string[],
    clients: number[]
};
function GradientPaneBase(props: GradientProps): JSX.Element {
    const {gradient, layers/*, clients*/} = props;
    const clients = [0,1,2,3,4];
    const prev = gradient.preRound.filter(v => clients.includes(v.id));
    const cur = gradient.curRound.filter(v => clients.includes(v.id));
    const firstData: Weight[] = cur.map((v,i) => ({
      id: v.id,
      vector: v.vector.map((v, index) => v - prev[i].vector[index])
    }));
    const secondData: Weight[] = cur.map(v => ({
      id: v.id,
      vector: v.vector.map((v, index) => v - gradient.avgRound[index])
    }));
    return (
      <div className='Frame GradientView'>
        Gradient
        <div className='gradient-div'>
          <LineChartPane 
            id='sub'
            title='This Round - Last Round'
            data={firstData}
            layersNum={gradient.layersNum}
            layers={layers}
          />
          <LineChartPane 
            id='aggregate'
            title='This Round – Aggregated Gradients'
            data={secondData}
            layersNum={gradient.layersNum}
            layers={layers}
          />
        </div>
      </div>
    );
}

const mapStateToProps = (state: State) => ({
  gradient: state.Gradient,
  layers: state.Model.layers,
  clients: state.Space.clients
});
export const GradientPane = connect(
  mapStateToProps,
  createDispatchHandler<UtilsAction>()
)(GradientPaneBase);