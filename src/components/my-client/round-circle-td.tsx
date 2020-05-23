import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { ClientRes } from '../../types';
import { circleColorArray } from './constants';

interface RoundCircleTDProps {
  clientRounds: ClientRes[];
}

export default function(props: RoundCircleTDProps): JSX.Element {
  const divRef = useRef<HTMLDivElement>(null);

  const STEP = 14;

  useEffect(() => {
    const divEle = divRef.current;
    if (divEle == null) {
      return;
    }
    const svg = d3
      .select(divEle)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%');
    svg
      .append('rect')
      .attr('x', '0%')
      .attr('y', '35%')
      .attr('width', '85%')
      .attr('height', '30%')
      .attr('fill', 'rgb(216, 216, 216)');
    for (let i = 0; i < circleColorArray.length; i++) {
      svg
        .append('circle')
        .attr('cx', `${STEP * (i + 1)}%`)
        .attr('cy', '50%')
        .attr('r', '5%')
        .attr('fill', circleColorArray[i]);
    }
  }, []);

  return <div ref={divRef} style={{ width: `100%`, height: `100%` }} />;
}
