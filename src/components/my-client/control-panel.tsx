import React, { useState, useEffect } from 'react';
import { Switch, Input } from 'antd';

interface ControlPanelProps {
  auto: boolean;
  latestRound: number;
  displayRound: number;
  setDisplayRound: (round: number) => void;
  setAuto: (auto: boolean) => void;
}

function changeDisplayInputValue(
  valueStr: string,
  latestRound: number,
  setDisplayInput: React.Dispatch<React.SetStateAction<string>>,
  setDisplayRound: (round: number) => void,
  setAuto: (auto: boolean) => void
) {
  // 输入就设置为非自动
  setAuto(false);

  if (valueStr === '') {
    setDisplayInput('');
    return;
  }
  const value = parseInt(valueStr, 10);
  if (isNaN(value) || value > latestRound) {
    setDisplayRound(latestRound);
    setDisplayInput(latestRound.toString());
  } else {
    setDisplayRound(value);
    setDisplayInput(value.toString());
  }
}

export default function(props: ControlPanelProps): JSX.Element {
  // 为了使输入正常，必须和 props.displayRound 分开处理
  const [displayInput, setDisplayInput] = useState(props.displayRound.toString());

  // 自动更新时，对应更新
  useEffect(() => {
    setDisplayInput(props.displayRound.toString());
  }, [props.displayRound]);

  return (
    <div
      style={{
        width: '16%',
        fontSize: 12,
        padding: '40px 8px 40px 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Round:</span> <span>{`${props.latestRound}/${500}`}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Display:{' '}
        <Input
          value={displayInput}
          style={{ height: 18, width: 50 }}
          onChange={(event) => {
            changeDisplayInputValue(
              event.target.value,
              props.latestRound,
              setDisplayInput,
              props.setDisplayRound,
              props.setAuto
            );
          }}
        />
      </div>
      <Switch
        checkedChildren="Auto"
        unCheckedChildren="Manu"
        checked={props.auto}
        style={{ width: 60 }}
        onClick={() => {
          props.setAuto(!props.auto);
        }}
      />
    </div>
  );
}
