import React from 'react';
import { Provider } from 'react-redux';
import GlobalStyle from './style';
import { HashRouter } from 'react-router-dom';
import Routes from './routes';
import store from './store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <HashRouter>
        <Routes />
      </HashRouter>
    </Provider>
  );
};

export default App;
