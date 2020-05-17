import React, { useEffect } from 'react';
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
import { ClientAction, BEGIN_GET_PERFORMANCE } from '../../actions';
import { createDispatchHandler, ActionHandler } from '../../actions/redux-action';

export interface ClientTableProps extends ActionHandler<ClientAction> {
  performance: Performance;
}

function ClientTable(props: ClientTableProps): JSX.Element {
  useEffect(() => {
    props.handleAction({
      type: BEGIN_GET_PERFORMANCE,
      payload: {
        round: 495,
        number: 5
      }
    });
  }, []);

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
  const ID_TD_WIDTH = 5;
  const ROUNDS_TD_WIDTH = 10;

  return (
    <TableWrapper>
      <TableOhterRow>
        <ControlPanel />
        <BoxPlotTD performance={props.performance} />
      </TableOhterRow>
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
                <TableItem key={index}>
                  <BarChartTD test={round.test} train={round.train} />
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
    performance: state.Client.performance
  }),
  createDispatchHandler()
)(ClientTable);
