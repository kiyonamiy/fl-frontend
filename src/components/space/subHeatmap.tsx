import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { ActionHandler, createDispatchHandler } from '../../actions/redux-action';
import { UtilsAction, SET_HIGHLIGHT_ROUND, SET_HIGHLIGHT_CLIENT } from '../../actions';
import { MetricValue, SpaceType } from '../../types';
import { connect } from 'react-redux';

export interface SubHeatMapProps extends ActionHandler<UtilsAction> {
    data: MetricValue[],
    stringSample: string[],
    round: number,
    roundIndex: number,
    id: SpaceType,
    clients: number[],
    colorMap: Function
}
function SubHeatmapPaneBase(props: SubHeatMapProps): JSX.Element {
  const {data, round, id, clients, stringSample, roundIndex} = props;
  const stringClients = clients.map(v => 'client-' + v);
  const width = 1000;
  const height = 170;

  const x = d3.scaleBand()
      .range([0, width])
      .domain(stringSample)
      .padding(0.1);
  const y = d3.scaleBand()
      .range([0, height])
      .domain(stringClients)
      .padding(0.1);
  const stepWidth = x.bandwidth();
  const stepHeight = y.bandwidth();
  const svgId = id === SpaceType.Anomaly ? 'anomaly-heatmap' : 'contribution-heatmap';
  useEffect(() => {
    const svg = d3.select('#' + svgId);
    svg.selectAll('*').remove();
    data.forEach(client => {
      const g = svg.append('g')
        .attr('class', `heatmap-group heatmap-client-${client.id}`);
      const clientRound = stringSample.map((v, i) => {
        if (i === roundIndex - 1 || i === roundIndex  + 1)
            return id === SpaceType.Anomaly ? 0 : -1;
        else
          return client.vector[+v];
      });
      g.selectAll('rect')
        .data(clientRound).enter()
        .append('rect')
          .attr('class', (v,i) => `rect-client-${client.id}-round${stringSample[i]}`)
          // @ts-ignore
          .attr('y', y('client-' + client.id))
          .attr('x', (v: number, i: number) => x(stringSample[i]))
          .attr('width', stepWidth)
          .attr('height', stepHeight)
          .attr('fill', (v: number) => props.colorMap(v));
    });

  }, [data, round, clients]);
  return (
    <div className='sub-heatmap-div'>
      <div className='sub-heatmap-title'>
        <p>History</p>
        <p>{id == SpaceType.Anomaly ? 'Anomaly' : 'Contribution'}</p>
      </div>
      <div className='sub-heatmap-round'>
        {clients.map((v, i) => {
          return (
            <p key={v} style={{position: 'absolute', top: y('client-' + v), height: stepHeight, lineHeight: stepHeight + 'px'}}
              onMouseEnter={() => {
                props.handleAction({
                  type: SET_HIGHLIGHT_CLIENT,
                  payload: {
                    client: v
                  }
                })
              }}
              onMouseLeave={() => {
                props.handleAction({
                  type: SET_HIGHLIGHT_CLIENT,
                  payload: {
                    client: -1
                  }
                })
              }}
            >
              {`Client ${v}`}
            </p>
          );
        })}
      </div>
      <div>
        <svg className='sub-heatmap-svg' id={svgId}>
        </svg>
      </div>
    </div>
  );
}

export const SubHeatmapPane = connect(
  null,
  createDispatchHandler<UtilsAction>()
)(SubHeatmapPaneBase);