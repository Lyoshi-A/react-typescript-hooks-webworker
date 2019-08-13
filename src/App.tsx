import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Board} from './components/board'

const App: React.FC = props => {
  return <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <Board />
    </div>
}

export default App;
