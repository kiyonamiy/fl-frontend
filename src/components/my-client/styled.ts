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
