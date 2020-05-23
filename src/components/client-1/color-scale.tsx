import React from 'react';
import { CIRCLE_COLOR_ARRAY, ROUND_COL_COUNT } from './constants';

interface ColorScaleProps {
  displayRound: number;
}

export default function(props: ColorScaleProps): JSX.Element {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div
        style={{
          height: '100%',
          width: '15%',
          textAlign: 'center',
          fontSize: 12
        }}
      >
        Round {props.displayRound - ROUND_COL_COUNT + 1}
      </div>
      <div
        style={{
          height: '100%',
          width: `${100 - 2 * 15}%`,
          background: `linear-gradient(to right, ${CIRCLE_COLOR_ARRAY.join(',')})`
        }}
      />
      <div
        style={{
          height: '100%',
          width: '15%',
          textAlign: 'center',
          fontSize: 12
        }}
      >
        Round {props.displayRound}
      </div>
    </div>
  );
}
