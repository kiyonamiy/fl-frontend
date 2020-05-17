import React from 'react';
import { Switch, Input } from 'antd';

export default function(): JSX.Element {
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
        <span>Round:</span> <span>{`${`495`}/${500}`}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Display: <Input value={493} style={{ height: 18, width: 50 }} />
      </div>
      <Switch
        checkedChildren="Auto"
        unCheckedChildren="Manu"
        defaultChecked
        style={{ width: 60 }}
      />
    </div>
  );
}
