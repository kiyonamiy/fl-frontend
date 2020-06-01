import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function(): JSX.Element {
  const modelInfo = [
    {
      id: '1',
      name: 'conv1',
      value: 6,
      color: '#9DC3E6'
    },
    {
      id: '2',
      name: '',
      value: 6,
      color: '#D9D9D9'
    },
    {
      id: '3',
      name: 'conv2',
      value: 4,
      color: '#9DC3E6'
    },
    {
      id: '4',
      name: '',
      value: 4,
      color: '#D9D9D9'
    },
    {
      id: '5',
      name: 'dense',
      value: 2,
      color: '#9DC3E6'
    },
    {
      id: '6',
      name: '',
      value: 2,
      color: '#D9D9D9'
    },
    {
      id: '7',
      name: '',
      value: 2,
      color: '#D9D9D9'
    }
  ];
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const divEle = divRef.current;
    if (divEle == null) {
      return;
    }
    const getWidth = (multiple: number) => divEle.clientWidth * multiple;
    const getHeight = (multiple: number) => divEle.clientHeight * multiple;

    const svgBoundingRect = {
      width: getWidth(0.8),
      height: getHeight(0.8),
      left: getWidth((1 - 0.8) / 2),
      top: getHeight((1 - 0.8) / 2)
    };

    const rectWidth = getWidth(0.025);
    const arrowWidth = (getWidth(1) - rectWidth * modelInfo.length) / (modelInfo.length - 1);

    const svg = d3
      .select(divEle)
      .append('svg')
      .attr('width', svgBoundingRect.width)
      .attr('height', svgBoundingRect.height)
      .attr('transform', `translate(${svgBoundingRect.left}, ${svgBoundingRect.top})`);

    const x = d3
      .scaleBand()
      .domain(modelInfo.map((d) => d.id))
      // scaleBand.domain 是一个数组；scaleLinear.domain [min. max] 二元
      // 左右有留空
      // .scaleLinear()
      // .domain([0, modelInfo.length - 1])
      .range([0, svgBoundingRect.width]);
    // svg.call(d3.axisBottom(x));

    const maxY = (d3.max(modelInfo, (d) => d.value) || 0) * 1.5;
    const y = d3
      .scaleLinear()
      .domain([-maxY, maxY])
      .range([svgBoundingRect.height, 0]);
    // svg.call(d3.axisRight(y));

    // 画长方形
    svg
      .selectAll()
      .data(modelInfo)
      .join('rect')
      // .append('line')
      .attr('x', (d) => x(d.id) as number)
      .attr('y', (d) => y(d.value))
      .attr('width', rectWidth)
      .attr('height', (d) => (y(0) - y(d.value)) * 2)
      .attr('stroke', 'none')
      .attr('fill', (d) => d.color);
    // 画连接箭头
    // svg
    //   .selectAll()
    //   .data(modelInfo)
    //   .join('line')
    //   .attr('x1', (d) => (x(d.id) as number) + rectWidth)
    //   .attr('y1', (d) => y(0))
    //   .attr('x2', (d) => (x(d.id) as number) + rectWidth + arrowWidth - 25)
    //   .attr('y2', (d) => y(0))
    //   .attr('stroke', 'black');
  }, []);
  return <div ref={divRef} style={{ width: '100%', height: '100%' }} />;
}
