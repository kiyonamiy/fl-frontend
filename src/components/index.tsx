import React from 'react';
import '../assets/css/frame.css';
import BoxPlot from './client/box-plot';
import ServerClient from './client/server-client';
import { BarChartPane } from './client/bar-chart';
import { SpacePane } from './space';
import ClientTable from './my-client/client-table';
import Client from './client-1';

export default function AppPane(): JSX.Element {
  return (
    <div>
      {/* <div className="Frame ClientView" id="ClientView">
        <BoxPlot />
        <ServerClient />
        <BarChartPane />
      </div> */}
      {/* <div className="Frame ClientView">
        <ClientTable />
      </div> */}
      <div className="Frame ClientView">
        <Client />
      </div>
      <SpacePane />
      <div className="Frame ModelView">Model</div>
      <div className="Frame GradientView">Gradient</div>
    </div>
  );
}
