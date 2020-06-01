import React, { useEffect } from 'react';
import { Weight } from '../../types';
import * as d3 from 'd3';
import { ActionHandler, createDispatchHandler } from '../../actions/redux-action';
import { UtilsAction, SET_HIGHLIGHT_CLIENT } from '../../actions';
import { connect } from 'react-redux';

export interface LineChartProps extends ActionHandler<UtilsAction> {
  id: string,
  title: string,
  data: Weight[],
  layersNum: number[],
  layers: string[],
}
function LineChartPaneBase(props: LineChartProps): JSX.Element {
    useEffect(() => {
      const width = 1000,
            height = 180;
      const margin = {top: 20, left: 50, right: 20, bottom: 20};

      const allNum = props.layersNum.reduce((prev, cur) => prev + cur, 0);
      const xValue: number[] = [];
      let prev = 0;
      props.layersNum.forEach((num) => {
        xValue.push(prev + (num / 2 | 0));
        prev += num;
      });
      const allVector = props.data.map(v => v.vector).reduce((prev, cur) => prev.concat(cur), []);
      const svg = d3.select(`#line-chart-${props.id}`)
        .attr('width', width)
        .attr('height', height);
      svg.selectAll('g').remove();
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const x = d3.scaleLinear()
        .domain([0, allNum])
        .range([0, width - margin.right - margin.left]);
      const yMax = Math.max(-Math.min(...allVector), Math.max(...allVector));
      const y = d3.scaleLinear()
        .domain([-yMax, yMax]).nice()
        .range([height - margin.bottom - margin.top, 0]);
      const xAxis = d3.axisBottom(x).tickValues(xValue).tickFormat((v,i) => props.layers[i]);
      const yAxis = d3.axisLeft(y).ticks(10).tickFormat(d3.format('.2s'));
      g.append('g')
        .attr('class', 'x_axis')
        .attr('transform', `translate(0, ${(height - margin.bottom - margin.top) / 2})`)
        .call(xAxis);
      g.append('g')
        .attr('class', 'y_axis')
        .call(yAxis);
      const line = d3.line<number>()
          .x((d: number, i: number) => x(i))
          .y(d => y(d));

      
      props.data.forEach(weight => {
        g.append('path')
          .attr('class', `gradient-${weight.id}`)
          .datum(weight.vector)
          .attr('fill', 'none')
          .attr('stroke', `url(#line-gradient-${props.id})`)
          .attr('stroke-width', 1.5)
          .attr('d', line)
          .on('mouseover', d => {
            props.handleAction({
              type: SET_HIGHLIGHT_CLIENT,
              payload: {
                client: weight.id
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
      });
    }, [props.data, props.layersNum])
    return (
      <div className='line-chart-div'>
          <svg className='line-chart-svg' id={`line-chart-${props.id}`}>
            <defs>
              <linearGradient id={`line-gradient-${props.id}`} gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='0' y2='180'>
                <stop offset='0' stopColor='blue'></stop>
                <stop offset={`${70/180}`} stopColor='blue'></stop>
                <stop offset={`${70/180}`} stopColor='red'></stop>
                <stop offset='1' stopColor='red'></stop>
              </linearGradient>
            </defs>
          </svg>
      </div>
    )
}

export const LineChartPane = connect(
  null,
  createDispatchHandler<UtilsAction>()
)(LineChartPaneBase);