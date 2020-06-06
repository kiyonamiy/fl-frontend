import React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { State, Utils } from '../../types';
import { createDispatchHandler, ActionHandler } from '../../actions/redux-action';
import { UtilsAction } from '../../actions/utils';

import './utils.css';

const unfocusFunc = () => {
    d3.select('.projection-svg').selectAll('circle').classed('unfocus', true);
    d3.select('#parallel-anomaly').selectAll('path').style('opacity', '0.2');
    d3.select('#parallel-contribution').selectAll('path').style('opacity', '0.2');
    d3.selectAll('.line-chart-svg').selectAll('path').style('opacity', '0.2');
    d3.selectAll('#anomaly-heatmap').selectAll('.heatmap-group').style('opacity', '0.2');
    d3.selectAll('#contribution-heatmap').selectAll('.heatmap-group').style('opacity', '0.2');
};

const focusFunc = (ids: number[], all=false) => {
    if (all) {
        d3.select('.projection-svg').selectAll('circle').classed('unfocus', false);
        d3.select('#parallel-anomaly').selectAll('path').style('opacity', '0.5');
        d3.select('#parallel-contribution').selectAll('path').style('opacity', '0.5');
        d3.selectAll('.line-chart-svg').selectAll('path').style('opacity', '1.0');
        d3.selectAll('#anomaly-heatmap').selectAll('.heatmap-group').style('opacity', '1.0');
        d3.selectAll('#contribution-heatmap').selectAll('.heatmap-group').style('opacity', '1.0');
        return;
    }
    ids.forEach(id => {
        d3.select('.projection-svg').select(`.projection-client-${id}`).classed('unfocus', false);
        d3.select('#parallel-anomaly').select(`.parallel-anomaly-client-${id}`).style('opacity', '1.0');
        d3.select('#parallel-contribution').selectAll(`.parallel-contribution-client-${id}`).style('opacity', '1.0');
        d3.selectAll('.line-chart-svg').selectAll(`.gradient-${id}`).style('opacity', '1.0');
        d3.selectAll('#anomaly-heatmap').selectAll(`.heatmap-client-${id}`).style('opacity', '1.0');
        d3.selectAll('#contribution-heatmap').selectAll(`.heatmap-client-${id}`).style('opacity', '1.0');
    });
};

const unfocusRound = () => {
    d3.selectAll('#anomaly-heatmap').selectAll('rect').style('opacity', '0.2');
    d3.selectAll('#contribution-heatmap').selectAll('rect').style('opacity', '0.2');
    d3.select('.heatmap-round-default').style('opacity', 0.3);
}

const focusRoundFunc = (clients: number[], id: number, left: number, all=false) => {
    if (all) {
        d3.selectAll('#anomaly-heatmap').selectAll('rect').style('opacity', '1.0');
        d3.selectAll('#contribution-heatmap').selectAll('rect').style('opacity', '1.0');
        d3.select('.heatmap-round-tooltip').html('');
        d3.select('.heatmap-round-default').style('opacity', 1.0);
        return;
    }
    d3.select('.heatmap-round-tooltip')
        .style('left', left + 'px')
        .html(`Round ${id}`);
    clients.forEach(client => {
        d3.selectAll('#anomaly-heatmap').selectAll(`.rect-client-${client}-round${id}`).style('opacity', '1.0');
        d3.selectAll('#contribution-heatmap').selectAll(`.rect-client-${client}-round${id}`).style('opacity', '1.0');
    });
}
export interface UtilsProps extends ActionHandler<UtilsAction> {
    utils: Utils,
    clients: number[]
};
function UtilsPaneBase(props: UtilsProps): JSX.Element {
    const {client, preClient, round, preRound, left} = props.utils;
    if (client !== preClient) {
        if (client === -1) {
            focusFunc([], true);
        }
        else if (client >= 0) {
            unfocusFunc();
            focusFunc([client]);
        }
    }
    if (round !== preRound) {
        if (round === -1)
            focusRoundFunc([], 0, 0, true);
        else if (round >= 0) {
            unfocusRound();
            focusRoundFunc(props.clients, round, left);
        }
    }
    return <div></div>;
}

const mapStateToProps = (state: State) => ({
    utils: state.Utils,
    clients: state.Space.clients,
});
export const UtilsPane = connect(
    mapStateToProps,
    createDispatchHandler<UtilsAction>(),
)(UtilsPaneBase);