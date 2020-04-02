import React from 'react';
import '../../assets/css/frame.css'
import BoxPlot from "./client/components/box-plot";
import ServerClient from "./client/components/server-client";
import BarChart from "./client/components/bar-chart";


export default function Home(): JSX.Element {
  return (
    <div>
      <div className='Frame ClientView' id='ClientView'>
        <BoxPlot></BoxPlot>
        <ServerClient></ServerClient>
        <BarChart></BarChart>
      </div>
      <div className='Frame SpaceView'>Space</div>
      <div className='Frame ModelView'>Model</div>
      <div className='Frame GradientView'>Gradient</div>
    </div>
  );
}
