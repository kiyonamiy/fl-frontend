import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { ActionHandler, createDispatchHandler } from '../../actions/redux-action';
import { UtilsAction, SET_HIGHLIGHT_ROUND, SET_HIGHLIGHT_CLIENT, DISPLAY_ROUND_INPUT_CHANGE, ClientAction } from '../../actions';
import { HistoryValue, MetricValue, SpaceType } from '../../types';
import { connect } from 'react-redux';
import { HEATMAP_WIDTH } from './constant';

export interface SubHeatMapProps extends ActionHandler<UtilsAction | ClientAction> {
    data: HistoryValue[],
    stringSample: string[],
    round: number,
    roundIndex: number,
    id: SpaceType,
    clients: number[],
    colorMap: Function
}
function SubHeatmapPaneBase(props: SubHeatMapProps): JSX.Element {
  const {data, round, id, clients, stringSample, roundIndex} = props;
  const height = 20;

  const x = d3.scaleBand()
      .range([0, HEATMAP_WIDTH])
      .domain(stringSample)
      .padding(0.1);
  const stepWidth = x.bandwidth();
  const svgId = id === SpaceType.Anomaly ? 'anomaly-heatmap' : 'contribution-heatmap';
  useEffect(() => {
    const svg = d3.select('#' + svgId);
    svg.selectAll('*').remove();
    const g = svg.append('g')
      .attr('class', `heatmap-group`)
      .style('transform', 'translate(0, 10px)');
    const sampleRound = stringSample.map((v, i) => {
      if (i === roundIndex - 1 || i === roundIndex  + 1)
          return id === SpaceType.Anomaly ? 0 : -1;
      else
        return data[+v].value;
    });
    g.selectAll('rect')
      .data(sampleRound).enter()
      .append('rect')
        .attr('class', (v,i) => `rect-round${stringSample[i]}`)
        // @ts-ignore
        .attr('y', 0)
        .attr('x', (v: number, i: number) => x(stringSample[i]) as any)
        .attr('width', stepWidth)
        .attr('height', height)
        .attr('fill', (v: number) => props.colorMap(v))
        .on('mouseover', (v: number, i: number) => {
          if (stringSample.includes('fix'))
            return;
          props.handleAction({
            type: SET_HIGHLIGHT_ROUND,
            payload: {
              round: +stringSample[i],
              left:  (x(stringSample[i]) as any) + stepWidth / 2 - 40,
            }
          });
        })
        .on('mouseleave', () => {
          props.handleAction({
            type: SET_HIGHLIGHT_ROUND,
            payload: {
              round: -1,
            }
          });
        })
        .on('dblclick', (v: number, i: number) => {
          if (stringSample.includes('fix'))
            return;
          props.handleAction({
            type: DISPLAY_ROUND_INPUT_CHANGE,
            payload: {
              displayRound: parseInt(stringSample[i])
            }
          });
        });
  }, [data, round, clients]);
  return (
    <div className='sub-heatmap-div'>
      <div className='sub-heatmap-title'>
        {id == SpaceType.Anomaly ? 'Anomaly' : 'Contribution'}
      </div>
      <svg className='sub-heatmap-svg' id={svgId}>
      </svg>
    </div>
  );
}

export const SubHeatmapPane = connect(
  null,
  createDispatchHandler<UtilsAction | ClientAction>()
)(SubHeatmapPaneBase);