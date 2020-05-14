import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { State, Parallel, MetricValue } from '../../types';
import { Select, OptionProps } from '../utils/select';

import './parallel.css';

export interface ParallelProps {
  title: string,
  id: 'contribution' | 'anomaly',
  data: Parallel,
  width: number,
  color: string,
};
function ParallelPaneBase(props: ParallelProps): JSX.Element {
  const {metrics, scale} = props.data;
  const [curMetrics, setcurMetrics] = useState(new Array(metrics.length).fill(true));
  
  const options: OptionProps[] = metrics.map((v,i) => {
    return {
      value: i,
      content: v
    }
  });

  const clickFucn = (index: number) => {
    const newCurMetrics = curMetrics.concat();
    newCurMetrics[index] = !newCurMetrics[index];
    setcurMetrics(newCurMetrics);
  };

  useEffect(() => {
      // set the dimensions and margins of the graph
    const margin = {top: 30, right: 10, bottom: 10, left: 0},
    width = 420 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select(`#parallel-${props.id}`);
    svg.selectAll('g').remove();
    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');

    const dimensions = metrics.map((v,i) => '' + i).filter((v,i) => curMetrics[i] === true);
    // For each dimension, I build a linear scale. I store all in a y object
    const y = scale.map(d =>
      d3.scaleLinear()
        .range([0, height])
        .domain(d));

    // Build the X scale -> it find the best position for each Y axis
    const x = d3.scalePoint()
      .range([0, width])
      .padding(0.4)
      .domain(dimensions);

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d: MetricValue) {
        // @ts-ignore
        return d3.line()(dimensions.map(p =>  [x(p), y[+p](d.vector[+p])]));
    }

    // Draw the lines
    g
      .selectAll('myPath')
      .data(props.data.value)
      .enter().append('path')
      .attr('d',  path)
      .attr('class', (d) => `parallel-${props.id}-client-${d.id}`)
      .style('fill', 'none')
      .style('stroke', props.color)
      .style('opacity', 0.5);

    // Draw the axis:
    g.selectAll('myAxis')
      // For each dimension of the dataset I add a 'g' element:
      .data(dimensions).enter()
      .append('g')
      // I translate this element to its right position on the x axis
      .attr('transform', d => 'translate(' + x(d) + ')')
      // And I build the axis with the call function
      .each(function(d) { d3.select(this).call(d3.axisLeft(y[+d])); })
      // Add axis title
      .append('text')
        .style('text-anchor', 'middle')
        .attr('y', -9)
        .text(d => metrics[+d])
        .style('fill', 'black')

  }, [props.data, curMetrics]);

  return (  
    <div className='parallel-view'>
        <div className='parallel-title'>
          {props.title}
        </div>
        <Select
          style={{
            width: props.width
          }}
          title='Metrics'
          options={options}
          selected={curMetrics}
          checkBox={true}
          btnClick={clickFucn}
        />
        <div className='parallel-div'>
          <svg className='parallel-svg' id={'parallel-' + props.id}>
          </svg>
        </div>
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
