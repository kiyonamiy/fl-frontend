import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  TableWrapper,
  TableHeaderWrapper,
  TableBodyWrapper,
  TableItem,
  TableRow,
  TableOhterRow
} from './styled';
import BarChartTD from './bar-chart-td';
import RoundCircleTD from './round-circle-td';
import ControlPanel from './control-panel';
import BoxPlotTD from './box-plot-td';

import { Performance, State, RoundRes, ClientRes } from '../../types';
import { ClientAction, BEGIN_GET_PERFORMANCE, SET_DISPLAY_ROUND, SET_AUTO } from '../../actions';
import { createDispatchHandler, ActionHandler } from '../../actions/redux-action';

export interface ClientTableProps extends ActionHandler<ClientAction> {
  performance: Performance;
  latestRound: number;
  displayRound: number;
  auto: boolean;
}

// 必须放在外边，放在ClientTable函数里边会一直被初始化
let timeoutId: number;

function ClientTable(props: ClientTableProps): JSX.Element {
  const [hoveredRound, setHoveredRound] = useState(-1);

  useEffect(() => {
    props.handleAction({
      type: BEGIN_GET_PERFORMANCE,
      payload: {
        round: props.latestRound,
        number: 5,
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
        type: BEGIN_GET_PERFORMANCE,
        payload: {
          round: props.latestRound + 1,
          number: 5,
          auto: props.auto
        }
      });
    }, 5000);
  }, [props.latestRound, props.auto]);

  // 将行列对调，更简单地按照每行 client 进行 rounds 的绘制
  const clientArray: ClientRes[][] = [];
  for (const round of props.performance) {
    for (const client of round.clients) {
      if (clientArray[client.id] == null) {
        clientArray[client.id] = [];
      }
      clientArray[client.id].push({
        train: client.train,
        test: client.test,
        id: client.id,
        round: round.round
      });
    }
  }
  // ID 和 rounds 两列所占百分比
  const ID_TD_WIDTH = 5;
  const ROUNDS_TD_WIDTH = 10;

  return (
    <TableWrapper>
      <TableOhterRow>
        {/* 左上角的控制面板 */}
        <ControlPanel
          auto={props.auto}
          latestRound={props.latestRound}
          displayRound={props.displayRound}
          setDisplayRound={(displayRound: number) => {
            props.handleAction({
              type: SET_DISPLAY_ROUND,
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
        {/* 右上角的盒须图 */}
        <BoxPlotTD performance={props.performance} />
      </TableOhterRow>
      {/* 表格头部（列说明）（ID Rounds Round1 Round2 Round3 Round4 Round5） */}
      <TableHeaderWrapper>
        <TableItem key="ID" width={ID_TD_WIDTH}>
          ID
        </TableItem>
        <TableItem key="Rounds" width={ROUNDS_TD_WIDTH}>
          Rounds
        </TableItem>
        {props.performance.map((aRound: RoundRes) => (
          <TableItem key={aRound.round}>Round {aRound.round}</TableItem>
        ))}
      </TableHeaderWrapper>
      {/* 表格主体（每行 client 的数据） */}
      <TableBodyWrapper>
        {clientArray.map((clientRounds, clientId) => {
          if (clientRounds == null) {
            return null;
          }
          return (
            // 一行 Client 数据
            <TableRow key={clientId}>
              <TableItem key={`id-${clientId}`} width={ID_TD_WIDTH}>
                {clientId}
              </TableItem>
              <TableItem key={`rounds-${clientId}`} width={ROUNDS_TD_WIDTH}>
                <RoundCircleTD clientRounds={clientRounds} />
              </TableItem>
              {clientRounds.map((round: ClientRes, index: number) => (
                <TableItem
                  key={index}
                  onMouseEnter={() => {
                    setHoveredRound(round.round);
                  }}
                  onMouseOut={() => {
                    setHoveredRound(-1);
                  }}
                >
                  <BarChartTD
                    test={round.test}
                    train={round.train}
                    isHovered={hoveredRound === round.round}
                  />
                </TableItem>
              ))}
            </TableRow>
          );
        })}
      </TableBodyWrapper>
    </TableWrapper>
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
)(ClientTable);
