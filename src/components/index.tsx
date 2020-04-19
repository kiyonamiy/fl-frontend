import React from 'react';
import '../assets/css/frame.css'
import BoxPlot from './client/box-plot';
import ServerClient from './client/server-client';
import { BarChartPane } from './client/bar-chart';



export default function AppPane(): JSX.Element {
  return (
    <div>
      <div className='Frame ClientView' id='ClientView'>
        <BoxPlot />
        <ServerClient />
        <BarChartPane />
      </div>
      <div className='Frame SpaceView'>Space</div>
      <div className='Frame ModelView'>Model</div>
      <div className='Frame GradientView'>Gradient</div>
    </div>
  );
}
