import React, { useEffect } from 'react';
import * as d3 from 'd3';
/// <reference path='../../types/module.d.ts'/>
import * as d3Lasso from 'd3-lasso';
import * as tsnejs from '../utils/tsne';
import { MetricValue } from '../../types';
import { connect } from 'react-redux';

import './projection.css';
import { ActionHandler, createDispatchHandler } from '../../actions/redux-action';
import { UtilsAction, SET_HIGHLIGHT_CLIENT } from '../../actions/utils';
import { SpaceAction, SET_LASSO_CLIENTS } from '../../actions';
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

export interface ProjectionProps extends ActionHandler<UtilsAction | SpaceAction>{
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
  let coordinates: number[][];
  if (data.length === 0) {
    coordinates = [];
  }
  else {
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
    coordinates = tsne.getSolution();
    coordinates = coordinates.map((v, i) => v.concat(i))
  }
  const xArray = coordinates.map(v => v[0]);
  const yArray = coordinates.map(v => v[1]);

  const margin = 5,
        height = 290,
        width = 400;
  const x = d3.scaleLinear()
  // @ts-ignore
    .domain(d3.extent(xArray)).nice()
    .range([margin, width - margin]);
  const y = d3.scaleLinear()
  // @ts-ignore
  .domain(d3.extent(yArray)).nice()
  .range([height - margin, margin]);

  
  useEffect(() => {
    if (coordinates.length == 0)
      return;
    const svg = d3.select('.projection-svg');
    const g = svg.append('g');
    const circles = g.selectAll('circle')
      .data(coordinates).enter()
        .append('circle')
        .attr('class', v => `projection-client-${v[2]}`)
        .attr('cx', v => x(v[0]))
        .attr('cy', v => y(v[1]))
        .attr('r', 3)
        .attr('fill', '#999')
        .on('mouseover', (v, i) => {
          props.handleAction({
            type: SET_HIGHLIGHT_CLIENT,
            payload: {
              client: i
            }
          });
        })
        .on('mouseleave', () => {
          props.handleAction({
            type: SET_HIGHLIGHT_CLIENT,
            payload: {
              client: -1
            }
          });
        });
    const lasso = d3Lasso.lasso()
      .closePathSelect(true)
      .closePathDistance(100)
      .items(circles)
      .targetArea(svg)
      .on("start", () => lasso_start())
      .on("draw", () => lasso_draw())
      .on("end", () => lasso_end());
     // Lasso functions
    const lasso_start = function() {
      lasso.items()
          .attr("r",3) // reset size
          .classed("not_possible",true)
          .classed("selected",false);
    };

    const lasso_draw = function() {

      // Style the possible dots
      lasso.possibleItems()
          .classed("not_possible",false)
          .classed("possible",true);

      // Style the not possible dot
      lasso.notPossibleItems()
          .classed("not_possible",true)
          .classed("possible",false);
    };

    const lasso_end = function() {
      // Reset the color of all dots
      lasso.items()
          .classed("not_possible",false)
          .classed("possible",false);

      // Style the selected dots
      lasso.selectedItems()
          .classed("selected",true)
          .attr("r", 5);
      const clients = lasso.selectedItems().data().map((v: number[]) => v[2]);
      props.handleAction({
        type: SET_LASSO_CLIENTS,
        payload: {
          clients: clients
        }
      });
      // Reset the style of the not selected dots
      lasso.notSelectedItems()
          .attr("r", 3);

    };
    svg.call(lasso);
  }, [coordinates]);
  return (
    <div className='projection-view'>
      <div className='parallel-title'>
        Embedding Space
      </div>
      <svg className='projection-svg'>
      </svg>
    </div>
  );
}

export const ProjectionPane = connect(
  null,
  createDispatchHandler<UtilsAction | SpaceAction>()
)(ProjectionPaneBase);
