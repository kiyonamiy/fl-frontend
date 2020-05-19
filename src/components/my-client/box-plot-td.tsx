import React, { useRef, useEffect } from 'react';
import { Performance } from '../../types';
import * as d3 from 'd3';
interface BoxPlotTDProps {
  performance: Performance;
}
interface RoundBoxPlotData {
  round: string;
  accuracyOutliers: number[];
  accuracyQuantiles: [number, number, number];
  accuracyRange: [number, number];
  lossOutliers: number[];
  lossQuantiles: [number, number, number];
  lossRange: [number, number];
}

/**
 * 计算绘制 boxplot 关键数据：quantiles, median, min and max
 * @param plainDataArray lossArray or accuracyArray
 */
function computeBoxPlot(data: number[]) {
  data.sort(d3.ascending);
  const q1 = d3.quantile(data, 0.25) as number;
  const median = d3.quantile(data, 0.5) as number;
  const q3 = d3.quantile(data, 0.75) as number;
  const interQuantileRange = q3 - q1;
  const min = q1 - 1.5 * interQuantileRange;
  const max = q1 + 1.5 * interQuantileRange;
  return {
    outliers: data.filter((d) => d < min || d > max),
    quantiles: [q1, median, q3] as [number, number, number],
    range: [min, max] as [number, number]
  };
}

/**
 * 处理数据，分类存储每一轮的所有的 accuray 和 loss，计算绘制 box plot 的关键数据。
 * @param data 原始的后端返回数据
 */
function getRoundBoxPlotDataArray(data: Performance): RoundBoxPlotData[] {
  const result: RoundBoxPlotData[] = [];
  // 遍历每轮
  for (const roundRes of data) {
    // 收集分类所有的 accuracy loss
    const accuracyArray: number[] = [];
    const lossArray: number[] = [];
    for (const client of roundRes.clients) {
      accuracyArray.push(client.train.accuracy);
      accuracyArray.push(client.test.accuracy);
      lossArray.push(client.train.loss);
      lossArray.push(client.test.loss);
    }
    // 计算
    const accuracyBoxPlot = computeBoxPlot(accuracyArray);
    const lossBoxPlot = computeBoxPlot(lossArray);
    // 存储这一轮结果
    const roundBoxPlotData: RoundBoxPlotData = {
      round: roundRes.round.toString(),
      accuracyOutliers: accuracyBoxPlot.outliers,
      accuracyQuantiles: accuracyBoxPlot.quantiles,
      accuracyRange: accuracyBoxPlot.range,
      lossOutliers: lossBoxPlot.outliers,
      lossQuantiles: lossBoxPlot.quantiles,
      lossRange: lossBoxPlot.range
    };
    result.push(roundBoxPlotData);
  }
  return result;
}

/**
 * 绘制 accuray 和 loss 的 plot box
 * @param data
 */
function drawBoxPlotChart(divEle: HTMLDivElement, data: RoundBoxPlotData[]) {
  d3.select(divEle)
    .select('svg')
    .remove();
  const margin = { top: 10, right: 26, bottom: 10, left: 30 };
  const width = divEle.clientWidth - margin.left - margin.right;
  const height = divEle.clientHeight - margin.top - margin.bottom;

  const BOX_WIDTH = 12;
  const BOX_STROKE_COLOR = '#D8D8D8';
  const INTERVAL = 10;

  // 用于 accuracy loss Y 轴 domain 确定
  let minAccuracy = Number.MAX_SAFE_INTEGER;
  let maxAccuracy = Number.MIN_SAFE_INTEGER;
  let minLoss = Number.MAX_SAFE_INTEGER;
  let maxLoss = Number.MIN_SAFE_INTEGER;
  for (const round of data) {
    minAccuracy = Math.min(round.accuracyRange[0], minAccuracy);
    maxAccuracy = Math.max(round.accuracyRange[1], maxAccuracy);
    minLoss = Math.min(round.lossRange[0], minLoss);
    maxLoss = Math.max(round.lossRange[1], maxLoss);
  }

  // 与 div 同等高宽的 svg 做底
  const svg = d3
    .select(divEle)
    .append('svg')
    .attr('width', divEle.clientWidth)
    .attr('height', divEle.clientHeight);

  // 添加 x 轴
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.round))
    .range([margin.left, margin.left + width])
    .paddingInner(1)
    .paddingOuter(0.5);
  // svg.append('g').call(d3.axisBottom(x));

  // 添加 accuracy y 轴
  const accuracyY = d3
    .scaleLinear()
    .domain([minAccuracy, maxAccuracy])
    .range([margin.top + height, margin.top]);
  svg
    .append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(accuracyY));

  // 画 accuracy 竖线
  svg
    .selectAll()
    .data(data)
    .enter()
    .append('line')
    .attr('x1', (d) => (x(d.round) as number) - INTERVAL / 2 - BOX_WIDTH / 2)
    .attr('y1', (d) => accuracyY(d.accuracyRange[0]))
    .attr('x2', (d) => (x(d.round) as number) - INTERVAL / 2 - BOX_WIDTH / 2)
    .attr('y2', (d) => accuracyY(d.accuracyRange[1]))
    .attr('stroke', BOX_STROKE_COLOR);
  // 画 accuracy 盒子
  svg
    .selectAll()
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => (x(d.round) as number) - INTERVAL / 2 - BOX_WIDTH)
    .attr('y', (d) => accuracyY(d.accuracyQuantiles[2]))
    .attr('width', BOX_WIDTH)
    .attr('height', (d) => accuracyY(d.accuracyQuantiles[0]) - accuracyY(d.accuracyQuantiles[2]))
    .attr('stroke', BOX_STROKE_COLOR)
    .attr('fill', 'white');
  // 画 accuracy median 横线
  svg
    .selectAll()
    .data(data)
    .enter()
    .append('line')
    .attr('x1', (d) => (x(d.round) as number) - INTERVAL / 2 - BOX_WIDTH)
    .attr('y1', (d) => accuracyY(d.accuracyQuantiles[1]))
    .attr('x2', (d) => (x(d.round) as number) - INTERVAL / 2)
    .attr('y2', (d) => accuracyY(d.accuracyQuantiles[1]))
    .attr('stroke', BOX_STROKE_COLOR);
  // 画 accuracy min 和 max 横线
  for (let i = 0; i < 2; i++) {
    svg
      .selectAll()
      .data(data)
      .enter()
      .append('line')
      .attr('x1', (d) => (x(d.round) as number) - INTERVAL / 2 - BOX_WIDTH)
      .attr('y1', (d) => accuracyY(d.accuracyRange[i]))
      .attr('x2', (d) => (x(d.round) as number) - INTERVAL / 2)
      .attr('y2', (d) => accuracyY(d.accuracyRange[i]))
      .attr('stroke', BOX_STROKE_COLOR);
  }

  // 添加 loss y 轴
  const lossY = d3
    .scaleLinear()
    .domain([minLoss, maxLoss])
    .range([margin.top + height, margin.top]);
  svg
    .append('g')
    .attr('transform', `translate(${margin.left + width}, 0)`)
    .call(d3.axisRight(lossY));

  // 画 loss 竖线
  svg
    .selectAll()
    .data(data)
    .enter()
    .append('line')
    .attr('x1', (d) => (x(d.round) as number) + INTERVAL / 2 + BOX_WIDTH / 2)
    .attr('y1', (d) => lossY(d.lossRange[0]))
    .attr('x2', (d) => (x(d.round) as number) + INTERVAL / 2 + BOX_WIDTH / 2)
    .attr('y2', (d) => lossY(d.lossRange[1]))
    .attr('stroke', BOX_STROKE_COLOR);
  // 画 loss 盒子
  svg
    .selectAll()
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => (x(d.round) as number) + INTERVAL / 2)
    .attr('y', (d) => lossY(d.lossQuantiles[2]))
    .attr('width', BOX_WIDTH)
    .attr('height', (d) => lossY(d.lossQuantiles[0]) - lossY(d.lossQuantiles[2]))
    .attr('stroke', BOX_STROKE_COLOR)
    .attr('fill', 'white');
  // 画 loss median 横线
  svg
    .selectAll()
    .data(data)
    .enter()
    .append('line')
    .attr('x1', (d) => (x(d.round) as number) + INTERVAL / 2)
    .attr('y1', (d) => lossY(d.lossQuantiles[1]))
    .attr('x2', (d) => (x(d.round) as number) + INTERVAL / 2 + BOX_WIDTH)
    .attr('y2', (d) => lossY(d.lossQuantiles[1]))
    .attr('stroke', BOX_STROKE_COLOR);
  // 画 loss min 和 max 横线
  for (let i = 0; i < 2; i++) {
    svg
      .selectAll()
      .data(data)
      .enter()
      .append('line')
      .attr('x1', (d) => (x(d.round) as number) + INTERVAL / 2)
      .attr('y1', (d) => lossY(d.lossRange[i]))
      .attr('x2', (d) => (x(d.round) as number) + INTERVAL / 2 + BOX_WIDTH)
      .attr('y2', (d) => lossY(d.lossRange[i]))
      .attr('stroke', BOX_STROKE_COLOR);
  }
}

export default function(props: BoxPlotTDProps): JSX.Element {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divEle = divRef.current;
    if (divEle == null) {
      return;
    }
    const roundBoxPlotDataArray = getRoundBoxPlotDataArray(props.performance);
    drawBoxPlotChart(divEle, roundBoxPlotDataArray);
  }, [props.performance]);

  return <div style={{ width: '85%', height: '100%' }} ref={divRef} />;
}