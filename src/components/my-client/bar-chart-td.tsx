import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const getAccuracyData = function(data: any[]) {
  return data.filter((value, index) => index < data.length / 2);
};

const getLossData = function(data: any[]) {
  return data.filter((value, index) => index >= data.length / 2);
};

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
    const ACCURACY_COLOR = `rgb(153, 172, 196)`;
    const LOSS_COLOR = `rgb(107, 73, 106)`;
    const data = [
      {
        band: 'train-accuracy',
        num: props.train.accuracy
      },
      {
        band: 'test-accuracy',
        num: props.test.accuracy
      },
      {
        band: 'train-loss',
        num: props.train.loss
      },
      {
        band: 'test-loss',
        num: props.test.loss
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
    const accuracyY = d3
      .scaleLinear()
      .range([margin.left, width - margin.right])
      .domain([0, (d3.max(getAccuracyData(data), (d) => d.num) as number) * 1.1]);
    const lossY = d3
      .scaleLinear()
      .range([margin.left, width - margin.right])
      .domain([0, (d3.max(getLossData(data), (d) => d.num) as number) * 1.1]);

    // append the rectangles for the bar chart
    svg
      .selectAll()
      .data(getAccuracyData(data))
      .enter()
      .append('rect')
      .attr('fill', (d) => (d.band.endsWith('accuracy') ? ACCURACY_COLOR : LOSS_COLOR))
      .attr('y', (d) => `${x(d.band) || 0}%`)
      .attr('x', `${margin.left}%`)
      .attr('height', `${x.bandwidth()}%`)
      .attr('width', (d) => `${accuracyY(d.num)}%`);

    svg
      .selectAll()
      .data(getLossData(data))
      .enter()
      .append('rect')
      .attr('fill', (d) => (d.band.endsWith('accuracy') ? ACCURACY_COLOR : LOSS_COLOR))
      .attr('y', (d) => `${x(d.band) || 0}%`)
      .attr('x', `${margin.left}%`)
      .attr('height', `${x.bandwidth()}%`)
      .attr('width', (d) => `${lossY(d.num)}%`);
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
