import React from 'react';
import { Provider } from 'react-redux';
import GlobalStyle from './style';
import { Route, HashRouter } from 'react-router-dom';
import store from './configureStore';
import AppPane from './components';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <HashRouter>
        <Route path="/" component={AppPane} />
      </HashRouter>
    </Provider>
  );
};

export default App;
