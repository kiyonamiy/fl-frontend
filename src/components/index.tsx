import React, { useEffect } from 'react';
import { AnalysisPane } from './analysis';
import { UtilsPane } from './utils';

import '../assets/css/frame.less';
import { ServerPane } from './server';

export default function AppPane(): JSX.Element {
  return (
    <div>      
      <ServerPane />
      <AnalysisPane />
      <UtilsPane />
    </div>
  );
}
