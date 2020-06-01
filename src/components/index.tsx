import '../assets/css/frame.css';
// import BoxPlot from './client/box-plot';
// import ServerClient from './client/server-client';
// import { BarChartPane } from './client/bar-chart';
import Client from './client-1';
import ModelInfo from './model-info';
import React, { useEffect } from 'react';
import '../assets/css/frame.css'
import BoxPlot from './client/box-plot';
import ServerClient from './client/server-client';
import { BarChartPane } from './client/bar-chart';
import { SpacePane } from './space';
import { UtilsPane } from './utils';
import { GradientPane } from './gradient';



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
      <div className="Frame ModelView">
        <ModelInfo />
      </div>
      <div className="Frame GradientView">Gradient</div>
      <SpacePane></SpacePane>
      <GradientPane></GradientPane>
      <div className='Frame ModelView'>Model</div>
      <UtilsPane></UtilsPane>
    </div>
  );
}
