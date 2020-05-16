import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import '../../assets/css/client/bar-chart.css';
import { Performance, State } from '../../types';
import { createDispatchHandler, ActionHandler } from '../../actions/redux-action';
import { ClientAction, BEGIN_GET_PERFORMANCE } from '../../actions';

// export interface BarChartProps extends ActionHandler<ClientAction> {
//   performance: Performance;
// }
function BarChart(props) {
  useEffect(() => {
    props.handleAction({
      type: BEGIN_GET_PERFORMANCE,
      payload: {
        round: 495,
        number: 5
      }
    });
  }, []);

  const createBarChart = (data) => {
    if (data.length === 0) {
      return;
    }

    // add rounds text
    const textBound = { width: 460, height: 30 };
    const textWidth = (textBound.width - 20) / data.length;

    const textSvg = d3
      .select('#ClientView')
      .append('svg')
      .attr('id', 'TextSvg');

    const text = textSvg
      .selectAll('text')
      .data(data)
      .join('text');

    text
      .attr('class', 'Text')
      .text(function(d) {
        return 'Round ' + d.round;
      })
      .attr('x', function(d, i) {
        return (0.3 + i) * textWidth;
      })
      .attr('y', 0.57 * textBound.height);

    // add bar charts
    const barBound = { width: 0.7 * textWidth, height: 80 };
    const barPadding = 20;
    const barSvg = d3.select('#BarSvg');
    barSvg.selectAll('g').remove();

    const gRound = barSvg
      .selectAll('g')
      .data(data)
      .join('g')
      .attr('transform', (d, i) => {
        return 'translate(' + textWidth * (0.3 + i) + ',' + 0 + ')';
      });

    const gClient = gRound
      .selectAll('g')
      .data((d) => {
        return d.clients;
      })
      .join('g')
      .attr('transform', (d, i) => {
        return 'translate(' + 0 + ',' + (barBound.height + barPadding) * i + ')';
      });

    // TODO: add grouped barchart for every client in every round

    let group = ['Auc', 'Loss'];

    let yGroup = d3
      .scaleBand()
      .domain(group)
      .rangeRound([0, barBound.height])
      .paddingInner(0.1);

    let y = d3
      .scaleBand()
      .domain(['0', '1'])
      .rangeRound([0, yGroup.bandwidth()])
      .padding(0.05);

    const xAucMax = Math.max(
      ...data.map((d) =>
        Math.max(...d.clients.map((c) => Math.max(c.train.accuracy, c.test.accuracy)))
      )
    );
    let xAuc = d3
      .scaleLinear()
      .domain([0, xAucMax])
      .nice()
      .rangeRound([0, barBound.width]);

    const xLossMax = Math.max(
      ...data.map((d) => Math.max(...d.clients.map((c) => Math.max(c.train.loss, c.test.loss))))
    );
    let xLoss = d3
      .scaleLinear()
      .domain([0, xLossMax])
      .nice()
      .rangeRound([0, barBound.width]);

    group.forEach((g, index) => {
      const gRect = gClient
        .append('g')
        .attr('id', (d) => d.id + '-' + d.round)
        .attr('transform', 'translate(0,' + yGroup(g) + ')');

      gRect
        .selectAll('rect')
        .data((d) => {
          return index == 0 ? [d.train.accuracy, d.test.accuracy] : [d.train.loss, d.test.loss];
        })
        .join('rect')
        .attr('class', (d, i) => {
          if (i === 0) {
            return 'Train' + g;
          } else if (i === 1) {
            return 'Test' + g;
          } else {
            return 'Error';
          }
        })
        .attr('x', 0)
        // @ts-ignore
        .attr('y', (d, i) => y(i))
        .attr('width', (d) => {
          if (g === 'Auc') {
            return xAuc(d) - xAuc(0);
          } else if (g === 'Loss') {
            return xLoss(d) - xLoss(0);
          } else {
            return 0;
          }
        })
        .attr('height', y.bandwidth());

      gRect
        .selectAll('text')
        .data((d) => {
          return [
            { id: d.id, round: d.round, name: 'Train' + g },
            { id: d.id, round: d.round, name: 'Test' + g }
          ];
        })
        .join('text')
        .text((d) => d.name)
        .attr('class', (d) => {
          return 'RectText Text' + d.id + '-' + d.round;
        })
        .attr('x', 2)
        // @ts-ignore
        .attr('y', (d, i) => {
          return y.bandwidth() * 0.7 + y(i);
        });

      gRect
        .on('mouseover', function() {
          let id = d3.select(this).attr('id');
          d3.selectAll('.Text' + id).style('display', 'block');
        })
        .on('mouseleave', function() {
          d3.selectAll('.RectText').style('display', 'none');
        });
    });
  };

  createBarChart(props.performance);
  // console.log(props.performance);
  return (
    <div id="BarContainer">
      <svg id="BarSvg" />
    </div>
  );
}

export const BarChartPane = connect(
  (state) => ({
    performance: state.Client.performance
  }),
  createDispatchHandler()
)(BarChart);
