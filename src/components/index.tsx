import React from 'react';
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
      <div className='Frame ClientView' id='ClientView'>
        <BoxPlot />
        <ServerClient />
        <BarChartPane />
      </div>
      <SpacePane></SpacePane>
      <GradientPane></GradientPane>
      <div className='Frame ModelView'>Model</div>
      <UtilsPane></UtilsPane>
    </div>
  );
}
