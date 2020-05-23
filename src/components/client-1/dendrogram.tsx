import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Performance } from '../../types';
import { ROUND_TRAIN_MINSS_FLAG } from './constants';

import './css/dendrogram.css';

interface DendrogramProps {
  performance: Performance;
}

interface ClientRect {
  clientId: number;
  rounds: number[];
}

/**
 * 计算每个 client de round 是否参与训练
 * @param performance
 */
function getClientRectArray(performance: Performance) {
  const clientRoundsMap = new Map<number, number[]>();
  for (const roundRes of performance) {
    for (const clientRes of roundRes.clients) {
      const rounds = clientRoundsMap.get(clientRes.id) || [];
      // 该轮 train 不缺失
      if (clientRes.train != null) {
        rounds.push(clientRes.round);
      } else {
        rounds.push(ROUND_TRAIN_MINSS_FLAG);
      }
      clientRoundsMap.set(clientRes.id, rounds);
    }
  }
  const result: ClientRect[] = [];
  clientRoundsMap.forEach((value, key) => {
    result.push({
      clientId: key,
      rounds: value
    });
  });
  return result;
}

export default function(props: DendrogramProps): JSX.Element {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const divEle = divRef.current;
    if (divEle == null) {
      return;
    }
    d3.select(divEle)
      .select('svg')
      .remove();
    d3.select(divEle)
      .select('div')
      .remove();

    const clientRectArray = getClientRectArray(props.performance);

    // 每个小长方形长宽
    const clientRectSize = {
      width: divEle.clientWidth * 0.4,
      height: divEle.clientHeight * 0.04,
      margin: {
        top: divEle.clientHeight * 0.01,
        right: divEle.clientWidth * 0.04,
        bottom: divEle.clientHeight * 0.01,
        left: divEle.clientWidth * 0.04
      }
    };
    // 每个长方形的ID前缀
    const RECT_ID_PREFIX = 'client-rect-';
    // 连线长方形的 class
    const RECT_DISPLAY_CLASS = 'client-rect-display';
    // 最外层的 svg 的 margin
    const margin = {
      top: 0 * divEle.clientHeight,
      right: 0.02 * divEle.clientWidth,
      bottom: 0.03 * divEle.clientHeight,
      left: 0.02 * divEle.clientWidth
    };
    // 最外层 svg 的 宽高
    const width = divEle.clientWidth - margin.left - margin.right;
    const height = divEle.clientHeight - margin.top - margin.bottom;

    // Server Client 节点半径
    const CLIENT_CIRCLE_RADIUS = 4;
    // Server Circle 信息
    const serverCircle = {
      cx: 20,
      cy: height * 0.5,
      r: 7
    };

    // Clients 容器信息
    const clientsContainerSize = {
      top: divEle.clientHeight * 0.06,
      left:
        divEle.clientWidth -
        margin.right -
        clientRectSize.margin.right -
        clientRectSize.width -
        clientRectSize.margin.left,
      width: divEle.clientWidth * 0.5,
      height: divEle.clientHeight * 0.93
    };

    const svg = d3
      .select(divEle)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // TODO 去掉硬编码
    // 添加 Server 节点(数字相对于字体调整)
    svg
      .append('circle')
      .attr('cx', serverCircle.cx)
      .attr('cy', serverCircle.cy)
      .attr('r', serverCircle.r)
      .attr('fill', '#D8D8D8');
    svg
      .append('text')
      .text('Server')
      .attr('x', 0)
      .attr('y', height * 0.5 - 20);
    // 添加 Clients 字符串
    svg
      .append('text')
      .text('Clients')
      .attr('x', clientsContainerSize.left + clientRectSize.width / 2 - 47.75 / 2)
      .attr('y', 16);

    // 添加容纳所有的 client 的 div svg（长宽设置）
    const containerSvg = d3
      .select(divEle)
      .append('div')
      .attr('id', 'clients-container')
      .style('position', 'absolute')
      .style('top', `${clientsContainerSize.top}px`)
      .style('left', `${clientsContainerSize.left}px`)
      .style('width', `${clientsContainerSize.width}px`)
      .style('height', `${clientsContainerSize.height}px`)
      .append('svg')
      .attr('width', '100%')
      .attr(
        'height',
        (clientRectSize.height + clientRectSize.margin.top + clientRectSize.margin.bottom) *
          clientRectArray.length
      );

    // 添加所有的长方形
    const gs = containerSvg
      .selectAll()
      .data(clientRectArray)
      .join('g');

    gs.append('rect')
      .attr('class', (d, i) => {
        // 长方形顶点所在高度，判断是否出现在可视窗口的高度内来分配 class；通过判断这个 class 来确定是否连线
        const rectY =
          clientRectSize.margin.top +
          (clientRectSize.margin.top + clientRectSize.height + clientRectSize.margin.bottom) * i;
        return rectY >= 0 &&
          rectY <= (document.querySelector('#clients-container')?.clientHeight || 0)
          ? RECT_DISPLAY_CLASS
          : '';
      })
      .attr('id', (d) => `${RECT_ID_PREFIX}${d.clientId}`)
      .attr('width', clientRectSize.width)
      .attr('height', clientRectSize.height)
      .attr('x', clientRectSize.margin.left)
      .attr(
        'y',
        (d, i) =>
          clientRectSize.margin.top +
          (clientRectSize.margin.top + clientRectSize.height + clientRectSize.margin.bottom) * i
      )
      .attr('fill', '#D8D8D8');

    // 在每一个长方形添加五个圆形
    const minRound = d3.min(clientRectArray, (d) => d.rounds[0]) || 0;
    const maxRound = d3.max(clientRectArray, (d) => d.rounds[d.rounds.length - 1]) || 0;
    console.log(minRound, maxRound);
    const circleX = d3
      .scaleLinear()
      .domain([minRound, maxRound])
      .range([
        clientRectSize.margin.left + CLIENT_CIRCLE_RADIUS * 2.5,
        clientRectSize.margin.left + clientRectSize.width - CLIENT_CIRCLE_RADIUS * 2.5
      ]);
    const colorScale = d3.scaleSequential(d3.interpolateYlGnBu);

    gs.selectAll()
      // 为了保存每个圆属于哪个 clientIndex，（为了 cy 取值）
      .data((d: ClientRect, index) =>
        d.rounds.map((round: number) => ({ round, clientIndex: index }))
      )
      .join('circle')
      .attr('r', CLIENT_CIRCLE_RADIUS)
      .attr('cx', (d) => circleX(d.round))
      .attr(
        'cy',
        (d) =>
          clientRectSize.margin.top +
          clientRectSize.height / 2 +
          (clientRectSize.margin.top + clientRectSize.height + clientRectSize.margin.bottom) *
            d.clientIndex
      )
      .attr('fill', (d) => {
        return colorScale((d.round - minRound) / (maxRound - minRound));
      });

    // 连接曲线
    svg
      .append('g')
      .selectAll()
      .data(clientRectArray)
      .join('path')
      .attr('d', (d: ClientRect, i) => {
        const rectClass = d3.select(`#${RECT_ID_PREFIX}${d.clientId}`).attr('class');
        if (rectClass !== RECT_DISPLAY_CLASS) {
          return null;
        }

        const startX = serverCircle.cx + serverCircle.r,
          startY = serverCircle.cy;
        const endX = clientsContainerSize.left,
          endY =
            0.06 * divEle.clientHeight -
            margin.top +
            clientRectSize.margin.top +
            clientRectSize.height / 2 +
            (clientRectSize.margin.top + clientRectSize.height + clientRectSize.margin.bottom) * i;

        const xi = d3.interpolateNumber(startX, endX),
          curvature = 0.7;
        const x1 = xi(curvature),
          x2 = xi(1 - curvature);
        return `M${startX},${startY}C${x1},${startY} ${x2},${endY} ${endX},${endY}`;
      })
      .attr('stroke', '#D8D8D8')
      .attr('fill', 'none');
  }, [props.performance]);

  return <div ref={divRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
}
