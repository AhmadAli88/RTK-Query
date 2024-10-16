import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import UsersComponent from './components/User';
import "./App.css"
function App() {
  return (
    <Provider store={store}>
      <UsersComponent />
    </Provider>
  );
}

export default App;
