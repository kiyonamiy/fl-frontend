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
import {
  ClientAction,
  SCHEDULED_UPDATE_LATEST_ROUND,
  SET_DISPLAY_ROUND,
  SET_AUTO,
  DISPLAY_ROUND_INPUT_CHANGE
} from '../../actions';
import { createDispatchHandler, ActionHandler } from '../../actions/redux-action';

interface ClientRow {
  clientId: number;
  rounds: ClientRes[];
  testAccuracyAvg: number;
}

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
      type: SCHEDULED_UPDATE_LATEST_ROUND,
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
        type: SCHEDULED_UPDATE_LATEST_ROUND,
        payload: {
          round: props.latestRound + 1,
          auto: props.auto
        }
      });
    }, 5000);
  }, [props.latestRound, props.auto]);

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
  // 再处理一遍
  const clientRowArray: ClientRow[] = [];
  clientIdMapRounds.forEach((rounds, clientId) => {
    const avg = rounds.reduce((prev, cur) => prev + cur.test.accuracy, 0) / rounds.length;
    clientRowArray.push({
      clientId,
      rounds,
      testAccuracyAvg: avg
    });
  });
  clientRowArray.sort((a, b) => a.testAccuracyAvg - b.testAccuracyAvg);

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
        {clientRowArray.map((clientRow) => {
          if (clientRow == null) {
            return null;
          }
          return (
            // 一行 Client 数据
            <TableRow key={clientRow.clientId}>
              <TableItem key={`id-${clientRow.clientId}`} width={ID_TD_WIDTH}>
                {clientRow.clientId}
              </TableItem>
              <TableItem key={`rounds-${clientRow.clientId}`} width={ROUNDS_TD_WIDTH}>
                <RoundCircleTD clientRounds={clientRow.rounds} />
              </TableItem>
              {clientRow.rounds.map((round: ClientRes, index: number) => (
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
