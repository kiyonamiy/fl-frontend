import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Empty } from 'antd';

import Home from './home';

const Page404 = () => <Empty description={<span>未知链接</span>} />;

export default () => (
  <Switch>
    {/* <Route path="/example" component={ExamplePage} key="example" /> */}
    <Route path="/home" component={Home} key="home" />
    <Route path="/" render={() => <Redirect to="/home" />} exact key="home" />
    <Route path="*" component={Page404} key="404" />
  </Switch>
);
