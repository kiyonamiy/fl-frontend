import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ActionHandler, createDispatchHandler } from '../../actions/redux-action';
import {
  ClientAction,
  SCHEDULED_UPDATE_LATEST_ROUND,
  DISPLAY_ROUND_INPUT_CHANGE,
  SET_AUTO
} from '../../actions';
import { State, Performance } from '../../types';

import ControlPanel from './control-panel';
import BoxPlot from './box-plot';
import ColorScale from './color-scale';
import BarList from './bar-list';
import Dendrogram from './dendrogram';
import { ROUND_COL_COUNT } from './constants';

export interface ClientProps extends ActionHandler<ClientAction> {
  performance: Performance;
  latestRound: number;
  displayRound: number;
  auto: boolean;
}

// 必须放在外边，放在ClientTable函数里边会一直被初始化
let timeoutId: number;

function Client(props: ClientProps): JSX.Element {
  useEffect(() => {
    props.handleAction({
      type: SCHEDULED_UPDATE_LATEST_ROUND,
      payload: {
        round: props.latestRound,
        number: ROUND_COL_COUNT,
        auto: true
      }
    });
  }, []);

  // latestRound 自增，[latestRound - 5, latestRound] 随之改变
  useEffect(() => {
    // 必须取消上一次的 timeout，不然因为闭包，将auto置为false，在上一次的timeout里auto还是为true，还是会自动更新一次
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      props.handleAction({
        type: SCHEDULED_UPDATE_LATEST_ROUND,
        payload: {
          round: props.latestRound + 1,
          number: ROUND_COL_COUNT,
          auto: props.auto
        }
      });
    }, 5000);
  }, [props.latestRound, props.auto]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ width: '100%', height: '30%', display: 'flex' }}>
        {/* 第一部分：控制面板 */}
        <div style={{ width: '30%', height: '100%' }}>
          <ControlPanel
            auto={props.auto}
            latestRound={props.latestRound}
            displayRound={props.displayRound}
            displayRoundInputChange={(displayRound: number) => {
              props.handleAction({
                type: DISPLAY_ROUND_INPUT_CHANGE,
                payload: {
                  displayRound
                }
              });
            }}
            setAuto={(auto: boolean) => {
              props.handleAction({
                type: SET_AUTO,
                payload: {
                  auto
                }
              });
            }}
          />
        </div>
        {/* 第二部分：颜色比例尺（上 10%） & 盒须图（下 90%） */}
        <div style={{ width: '70%', height: '100%' }}>
          <div style={{ width: '100%', height: '8%' }}>
            <ColorScale displayRound={props.displayRound} />
          </div>
          <div style={{ width: '100%', height: '92%' }}>
            <BoxPlot performance={props.performance} />
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: '70%', display: 'flex' }}>
        {/* 第三部分：树状图 */}
        <div style={{ width: '30%', height: '100%' }}>
          <Dendrogram performance={props.performance} />
        </div>
        {/* 第四部分：柱状图列表 */}
        <div style={{ width: '70%', height: '100%' }}>
          <BarList performance={props.performance} />
        </div>
      </div>
    </div>
  );
}

export default connect(
  (state: State) => ({
    performance: state.Client.performance,
    latestRound: state.Client.latestRound,
    displayRound: state.Client.displayRound,
    auto: state.Client.auto
  }),
  createDispatchHandler()
)(Client);
