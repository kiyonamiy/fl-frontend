import styled from 'styled-components';

const TableRowMixin = `
  display: flex;
  height: 15%;
  border-bottom: 1px solid #f0f0f0;
`;

export const TableWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, segoe ui, Roboto, helvetica neue, Arial, noto sans,
    sans-serif, apple color emoji, segoe ui emoji, segoe ui symbol, noto color emoji;
`;

export const TableOhterRow = styled.div`
  ${TableRowMixin}
  height: 25%
`;

export const TableHeaderWrapper = styled.div`
  ${TableRowMixin}
  height: 4%;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  background: #fafafa;
`;

export const TableBodyWrapper = styled.div`
  height: 70%;
  overflow: auto;
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

//TODO 硬编码 除以 7
export const TableItem = styled.div`
  flex: 1 1 ${(props: { width?: number }) => props.width || 100 / 7}%;
  overflow: hidden;

  /* 居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: 1px solid red; */
`;
