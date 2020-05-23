import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Performance, ClientRes, RoundRes } from '../../types';
import { CLIENT_ROW_COUNT, ROUND_COL_COUNT } from './constants';

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

interface BarListProps {
  performance: Performance;
}

interface ClientRow {
  clientId: number;
  rounds: ClientRes[];
  testAccuracyAvg: number;
}

function BarChartTD(props: BarChartTDProps): JSX.Element {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divEle = divRef.current;
    if (divEle == null) {
      return;
    }
    d3.select(divEle)
      .select('svg')
      .remove();

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
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
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
      .range([margin.top, margin.top + height])
      .domain(data.map((d) => d.band))
      .padding(0.07);
    const accuracyY = d3
      .scaleLinear()
      .range([margin.left, width - margin.right])
      .domain([0, d3.max(getAccuracyData(data), (d) => d.num) as number]);
    const lossY = d3
      .scaleLinear()
      .range([margin.left, width - margin.right])
      .domain([0, d3.max(getLossData(data), (d) => d.num) as number]);

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

export default function(props: BarListProps) {
  // 将行列对调，更简单地按照每行 client 进行 rounds 的绘制
  const clientIdMapRounds = new Map<number, ClientRes[]>();
  for (const round of props.performance) {
    for (const client of round.clients) {
      let rounds: ClientRes[] = clientIdMapRounds.get(client.id) || [];
      rounds.push({
        train: client.train,
        test: client.test,
        id: client.id,
        round: round.round
      });
      clientIdMapRounds.set(client.id, rounds);
    }
  }
  // 再处理一遍，主要是为了显示、排序和筛选
  let clientRowArray: ClientRow[] = [];
  clientIdMapRounds.forEach((rounds, clientId) => {
    const avg = rounds.reduce((prev, cur) => prev + cur.test.accuracy, 0) / rounds.length;
    clientRowArray.push({
      clientId,
      rounds,
      testAccuracyAvg: avg
    });
  });
  clientRowArray = clientRowArray
    .sort((a, b) => a.testAccuracyAvg - b.testAccuracyAvg)
    .filter((value, index) => index < CLIENT_ROW_COUNT);
  return (
    <div style={{ height: '100%', width: '100%', padding: '0 7%' }}>
      <div style={{ height: '5%', width: '100%', display: 'flex' }}>
        {props.performance.map((aRound: RoundRes) => (
          <div
            key={aRound.round}
            style={{ width: `${100 / ROUND_COL_COUNT}%`, height: '100%', textAlign: 'center' }}
          >
            Round {aRound.round}
          </div>
        ))}
      </div>
      <div style={{ height: '95%', width: '100%' }}>
        {clientRowArray.map((clientRow) => (
          <div
            key={clientRow.clientId}
            style={{ width: '100%', height: `${100 / CLIENT_ROW_COUNT}%`, display: 'flex' }}
          >
            {clientRow.rounds.map((round) => (
              <div
                key={round.round}
                style={{
                  width: `${100 / ROUND_COL_COUNT}%`,
                  height: '100%'
                  // border: '1px solid red'
                }}
              >
                <BarChartTD
                  test={round.test}
                  train={round.train}
                  isHovered={false}
                  // isHovered={hoveredRound === round.round}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
