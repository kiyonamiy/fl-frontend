import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BarChartTDProps {
  isHovered: boolean;
  test: {
    accuracy: number;
    loss: number;
  };
  train: {
    accuracy: number;
    loss: number;
  };
}

export default function(props: BarChartTDProps): JSX.Element {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divEle = divRef.current;
    if (divEle == null) {
      return;
    }
    const TRAIN_COLOR = `rgb(153, 172, 196)`;
    const TEST_COLOR = `rgb(107, 73, 106)`;
    const data = [
      {
        band: 'test-accuracy',
        num: props.test.accuracy
      },
      {
        band: 'test-loss',
        num: props.test.loss
      },
      {
        band: 'train-accuracy',
        num: props.train.accuracy
      },
      {
        band: 'train-loss',
        num: props.train.loss
      }
    ];

    // set the dimensions and margins of the graph
    const margin = { top: 3, right: 0, bottom: 3, left: 3 };
    const width = 100 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const svg = d3
      .select(divEle)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    // set the ranges
    const x = d3
      .scaleBand()
      .range([margin.top, height - margin.bottom])
      .domain(data.map((d) => d.band))
      .padding(0.07);
    const y = d3
      .scaleLinear()
      .range([margin.left, width - margin.right])
      .domain([0, d3.max(data, (d) => d.num) || 0]);

    // append the rectangles for the bar chart
    svg
      .selectAll()
      .data(data)
      .enter()
      .append('rect')
      .attr('fill', (d) => (d.band.startsWith('train') ? TRAIN_COLOR : TEST_COLOR))
      .attr('y', (d) => `${x(d.band) || 0}%`)
      .attr('x', `${margin.left}%`)
      .attr('height', `${x.bandwidth()}%`)
      .attr('width', (d) => `${y(d.num)}%`);
  });
  // 必须在这个div设置长度和宽度，不然上面取不到！！！
  return (
    <div
      ref={divRef}
      style={{
        width: `100%`,
        height: `100%`,
        background: `${props.isHovered ? 'rgb(228, 228, 228)' : 'white'}`
      }}
    />
  );
}
