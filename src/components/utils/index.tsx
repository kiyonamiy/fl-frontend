import React from 'react';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { State } from '../../types';
import { createDispatchHandler, ActionHandler } from '../../actions/redux-action';
import { UtilsAction } from '../../actions/utils';

import './utils.css';

const unfocusFunc = () => {
    d3.select('.projection-svg').selectAll('circle').classed('unfocus', true);
    d3.select('#parallel-anomaly').selectAll('path').style('opacity', '0.2');
    d3.select('#parallel-contribution').selectAll('path').style('opacity', '0.2');
};

const focusFunc = (ids: number[], all=false) => {
    if (all) {
        d3.select('.projection-svg').selectAll('circle').classed('unfocus', false);
        d3.select('#parallel-anomaly').selectAll('path').style('opacity', '0.5');
        d3.select('#parallel-contribution').selectAll('path').style('opacity', '0.5');
        return;
    }
    ids.forEach(id => {
        d3.select('.projection-svg').select(`.projection-client-${id}`).classed('unfocus', false);
        d3.select('#parallel-anomaly').select(`.parallel-anomaly-client-${id}`).style('opacity', '1.0');
        d3.select('#parallel-contribution').selectAll(`.parallel-contribution-client-${id}`).style('opacity', '1.0');
    });
};

export interface UtilsProps extends ActionHandler<UtilsAction> {
    client: number,
    preClient: number
};
function UtilsPaneBase(props: UtilsProps): JSX.Element {
    if (props.client === -1) {
        focusFunc([], true);
    }
    else if (props.client >= 0) {
        unfocusFunc();
        focusFunc([props.client]);
    }
    return <div></div>;
}

const mapStateToProps = (state: State) => ({
    client: state.Utils.client,
    preClient: state.Utils.preClient
});
export const UtilsPane = connect(
    mapStateToProps,
    createDispatchHandler<UtilsAction>(),
)(UtilsPaneBase);