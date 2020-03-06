import React from 'react';
import { connect } from 'react-redux';

import CombinedStoreState from '../../types/common/store';
import { StoreState, StoreDispatch } from '../../types/example-page/store';
import { Props } from '../../types/example-page/props';
import { Dispatch } from 'redux';
import { getIncreaseAction, getDecreaseAction } from './store/action-creators';

import { Card, Button } from 'antd';

function ExamplePage(props: Props): JSX.Element {
  const { sum } = props;
  const { inrease, decrease } = props;
  return (
    <Card>
      <h1>{sum}</h1>
      <div
        style={{
          width: 200,
          height: 100
        }}
      >
        <Button
          style={{
            display: `block`,
            float: `left`,
            width: `50%`,
            height: `100%`
          }}
          type="primary"
          onClick={inrease}
        >
          +
        </Button>
        <Button
          style={{
            display: `block`,
            float: `right`,
            width: `50%`,
            height: `100%`
          }}
          type="danger"
          onClick={() => {
            decrease(2);
          }}
        >
          -
        </Button>
      </div>
    </Card>
  );
}

const mapStateToProps = (state: CombinedStoreState): StoreState => ({
  sum: state.examplePage.sum
});

const mapDispatchToProps = (dispatch: Dispatch): StoreDispatch => ({
  inrease: (): void => {
    dispatch(getIncreaseAction());
  },
  decrease: (number: number): void => {
    dispatch(getDecreaseAction(number));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ExamplePage);
