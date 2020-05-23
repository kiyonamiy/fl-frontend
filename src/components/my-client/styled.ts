import styled from 'styled-components';
import { circleColorArray, tableTotalColCount, roundColCount } from './constants';

const TableRowMixin = `
  display: flex;
  height: 14%;
  // border-bottom: 1px solid #f0f0f0;
`;

export const TableWrapper = styled.div`
  position: relative;
  left: 10%;
  width: 90%;
  height: 100%;
  padding: 0px 10px;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, segoe ui, Roboto, helvetica neue, Arial, noto sans,
    sans-serif, apple color emoji, segoe ui emoji, segoe ui symbol, noto color emoji;
`;

export const TableHeaderWrapper = styled.div`
  ${TableRowMixin}
  height: 4%;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  //background: #fafafa;
`;

export const TableBodyWrapper = styled.div`
  position: relative;
  height: 70%;
  /* overflow: auto; */
  /*控制整个滚动条*/
  ::-webkit-scrollbar {
    background-color: white;
    width: 5px;
    height: 5px;
    background-clip: padding-box;
  }

  /*滚动条两端方向按钮*/
  ::-webkit-scrollbar-button {
    background-color: white;
  }

  /*滚动条中间滑动部分*/
  ::-webkit-scrollbar-thumb {
    background-color: rgb(222, 222, 222);
    border-radius: 5px;
  }

  /*滚动条右下角区域*/
  ::-webkit-scrollbar-corner {
  }
`;

export const TableRow = styled.div`
  ${TableRowMixin}
`;

export const TableItem = styled.div`
  position: relative;
  flex: 1 1 ${(props: { width?: number }) => props.width || 100 / tableTotalColCount}%;
  overflow: hidden;
  /* border: 1px solid red; */ // 测试

  /* 内部居中 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RoundColorScale = styled.div`
  flex: 1 1;
  background: linear-gradient(to right, ${circleColorArray.join(',')});
`;

/* export const AlreadyRoundProgress = styled.div`
  position: absolute;
  bottom: 0;
  width: ${80}%;
  height: 10%;
  background: rgb(94, 112, 168);
`; */
