import React from 'react';
import * as d3 from 'd3';
import * as tsnejs from '../utils/tsne';
import { MetricValue } from '../../types';
import { connect } from 'react-redux';

import './projection.css';
import { ActionHandler, createDispatchHandler } from '../../actions/redux-action';
import { UtilsAction, SET_HIGHLIGHT_CLIENT } from '../../actions/utils';
const cos = (a: number[], b: number[]): number => {
  if (a.length !== b.length)
    console.assert('Lenght of array A && B to Cos are not equal!');
  let res = 0, 
      sumA = 0,
      sumB = 0,
      length = a.length;
  for (let index = 0; index < length; index++) {
    res += a[index] * b[index];
    sumA += a[index] ** 2;
    sumB += a[index] ** 2;
  }
  return res / (Math.sqrt(sumA) * Math.sqrt(sumB));
};

const sim2dist = (matrix: number[][]): number[][] => {
  const newMatrix = matrix.reduce((prev, cur) => prev.concat(cur), []);
  const normalize = d3.scaleLinear()
      .domain([Math.min(...newMatrix), Math.max(...newMatrix)])
      .range([0, 1]);

  const result = [];
  for (let i = 0; i < matrix.length; i++) {
      result.push(matrix[i].map(v => 1 - normalize(v)));
  }

  return result;
}
export interface ProjectionProps extends ActionHandler<UtilsAction>{
  data: MetricValue[],
  anomalyFilter: boolean[],
  contributionFilter: boolean[]
};
function ProjectionPaneBase(props: ProjectionProps): JSX.Element {
  const opt = {
    epsilon: 10,
    perplexity: 30,
    dim: 2
  };
  const tsne = new tsnejs.tSNE(opt);
  const filterArray = props.anomalyFilter.concat(props.contributionFilter);
  const data: MetricValue[] = props.data.map(v => {
    return {
      id: v.id,
      vector: v.vector.filter((v,i) => filterArray[i])
    }
  });
  if (data.length === 0) {
    return (
      <div className='projection-view'>
  
      </div>
    );
  }

  const cosMatrix = [];
  const length = data.length;
  for(let i = 0; i < length; i++){
    const row = [];
    for(var j = 0; j < length; j++){
        row.push(cos(data[i].vector, data[j].vector));
    }
    cosMatrix.push(row);
  }

  const distMatrix = sim2dist(cosMatrix);
  tsne.initDataDist(distMatrix);
  for (let k = 0; k < 2000; k++) {
    tsne.step();
  }

  const coordinates: number[][] = tsne.getSolution();
  const xArray = coordinates.map(v => v[0]);
  const yArray = coordinates.map(v => v[1]);

  const margin = 5,
        height = 300,
        width = 400;
  const x = d3.scaleLinear()
  // @ts-ignore
    .domain(d3.extent(xArray)).nice()
    .range([margin, width - margin]);
  const y = d3.scaleLinear()
  // @ts-ignore
  .domain(d3.extent(yArray)).nice()
  .range([height - margin, margin]);

  return (
    <div className='projection-view'>
      <div className='parallel-title'>
        Embedding Space
      </div>
      <svg className='projection-svg'>
        <g>
          {coordinates.map((v, i) => 
            <circle
              key={i}
              className={`projection-client-${i}`}
              cx={x(v[0])}
              cy={y(v[1])}
              r={3}
              onMouseOver={() => {
                props.handleAction({
                  type: SET_HIGHLIGHT_CLIENT,
                  payload: {
                    client: i
                  }
                });
              }}
              onMouseLeave={() => {
                props.handleAction({
                  type: SET_HIGHLIGHT_CLIENT,
                  payload: {
                    client: -1
                  }
                });
              }}
            />
          )}
        </g>
      </svg>
    </div>
  );
}

export const ProjectionPane = connect(
  null,
  createDispatchHandler<UtilsAction>()
)(ProjectionPaneBase);
