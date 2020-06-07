import React from 'react';
import * as d3 from 'd3';
import { ActionHandler, createDispatchHandler } from '../../actions/redux-action';
import { SpaceAction, UtilsAction } from '../../actions';
import { connect } from 'react-redux';
import { State, Heatmap, MetricValue, SpaceType } from '../../types';

import './heatmap.css';
import { sumBoolean } from '../utils/math';
import { getSpaceRound, getEndRound } from '../utils/selector';
import { sampleToFix } from '../utils/math';
import { SubHeatmapPane } from './subHeatmap';

export interface HeatMapProps extends ActionHandler<SpaceAction | UtilsAction> {
  round: number,
  allRound: number,
  heatmap: Heatmap,
  clients: number[],
  anomalyFilter: boolean[],
  contributionFilter: boolean[],
}
const anomalyColorMap = d3.scaleLinear<string>().domain([0,1]).range(['white', '#699a47']);
const contributionColorMap = d3.scaleLinear<string>().domain([-1, 1]).range(['white', '#c96f32']);
function HeatmapPaneBase(props: HeatMapProps): JSX.Element {
  const {clients, heatmap, anomalyFilter, contributionFilter, round, allRound} = props;
  const anomalyData: MetricValue[] = [];
  const contributData: MetricValue[] = [];
  const anomalyNum = Math.max(1, sumBoolean(anomalyFilter));
  const contributionNum = Math.max(1, sumBoolean(contributionFilter));
  if (heatmap.length === 0 || clients.length === 0)
    return <div></div>;

  clients.forEach(id => {
    if (heatmap[id].id !== id) {
      console.assert('index of heatmap is unequal to property of idx!');
    }
    const vector = [];
    for (let roundIndex = 0; roundIndex < allRound; roundIndex++) {
      let element = 0;
      heatmap[id].anomaly.forEach((v, typeIndex) => {
        if (anomalyFilter[typeIndex] === true)
          element += v[roundIndex];
      })
      vector.push(element / anomalyNum);
    }
    anomalyData.push({
      id: id,
      vector: vector
    });
    const cVector = [];
    for (let roundIndex = 0; roundIndex < allRound; roundIndex++) {
      let element = 0;
      heatmap[id].anomaly.forEach((v, typeIndex) => {
        if (anomalyFilter[typeIndex] === true)
          element += v[roundIndex];
      })
      cVector.push(element / contributionNum);
    }
    contributData.push({
      id: id,
      vector: cVector
    });
  });

  const sample = sampleToFix(allRound, 100, round);
  const stringSample: string[] = [];
  let roundIndex = 0;
  sample.forEach(v => {
    if (v === round) {
      stringSample.push(...['fix-left', '' + v, 'fix-right']);
      roundIndex = stringSample.length - 2;
    }
    else {
      stringSample.push('' + v);
    }
  });
  const x = d3.scaleBand()
      .range([0, 1000])
      .domain(stringSample)
      .padding(0.1);
  const stepWidth = x.bandwidth();
  const roundLeft: string = (x(stringSample[roundIndex]) as any) + stepWidth / 2 - 40 + 'px';
  return (
    <div className='heatmap-div'>
      <SubHeatmapPane 
        data={anomalyData}
        round={round}
        roundIndex={roundIndex}
        stringSample={stringSample}
        id={SpaceType.Anomaly}
        clients={clients}
        colorMap={anomalyColorMap}
      />
      <div className='heatmap-round-div'>
        <p className='heatmap-round-show heatmap-round-tooltip' style={{left: 0}}>
        </p>
        <p className='heatmap-round-show heatmap-round-default' style={{left: roundLeft}}>
          {`Round ${stringSample[roundIndex]}`}
        </p>
      </div>
      <SubHeatmapPane 
        data={contributData}
        round={round}
        roundIndex={roundIndex}
        stringSample={stringSample}
        id={SpaceType.Contribution}
        clients={clients}
        colorMap={contributionColorMap}
      />
    </div>
  );
}

const mapStateToProps = (state: State) => ({
  heatmap: state.Space.heatmap,
  clients: state.Space.clients,
  anomalyFilter: state.Space.anomalyFilter,
  contributionFilter: state.Space.contributionFilter,
  round: getSpaceRound(state),
  allRound: getEndRound(state)
});
export const HeatmapPane = connect(
  mapStateToProps,
  createDispatchHandler<SpaceAction | UtilsAction>()
)(HeatmapPaneBase);