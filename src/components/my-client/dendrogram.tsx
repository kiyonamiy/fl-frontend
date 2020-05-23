import React, { useRef, useEffect, Children } from 'react';
import { clientRowCount } from './constants';
import * as d3 from 'd3';

interface TreeNode {
  name: string;
  children: TreeNode[];
}

function curve(startX: number, startY: number, endX: number, endY: number) {
  endX += 42;
  let curvature = 0.5;
  // same with the position of the serverRect and ClientRect
  const xi = d3.interpolateNumber(startX, endX),
    x0 = xi(curvature),
    x1 = xi(1 - curvature);
  return (
    'M' +
    startX +
    ',' +
    startY +
    'C' +
    x0 +
    ',' +
    startY +
    ' ' +
    x1 +
    ',' +
    endY +
    ' ' +
    endX +
    ',' +
    endY
  );
}

export default function() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divEle = divRef.current;
    if (divEle == null) {
      return;
    }
    // 为了树状结构而虚构的 data
    const structData: TreeNode = {
      name: 'root',
      children: new Array(clientRowCount).fill(0).map((v, i) => ({ name: `${i}`, children: [] }))
    };

    const cluster = d3.cluster().size([divEle.clientHeight, divEle.clientWidth]);
    const root = d3.hierarchy(structData, (d) => d.children);
    cluster(root);
    console.log(root.descendants().slice(1));

    const svg = d3
      .select(divEle)
      .append('svg')
      .attr('width', divEle.clientWidth)
      .attr('height', divEle.clientHeight);

    svg
      .selectAll('path')
      .data(root.descendants().slice(1))
      .enter()
      .append('path')
      .attr('d', (d: any) => curve(d.y, d.x, d.parent.y, d.parent.x))
      .style('fill', 'none')
      .style('stroke', '#ccc');

    svg
      .append('text')
      .text('Server')
      .attr('x', '0')
      .attr('y', '50.5%');
  }, []);

  return (
    <div
      ref={divRef}
      style={{
        width: '13%',
        height: '100%',
        position: 'absolute',
        left: '-13%'
      }}
    />
  );
}
