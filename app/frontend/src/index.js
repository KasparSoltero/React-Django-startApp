import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { 
  Second,
  Home,
  Audio,
  Fourth,
  Menu
} from './Components/components';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/second' element={<Second />} />
      <Route path='/audio' element={<Audio />} />
      <Route path='/fourth' element={<Fourth />} />
    </Routes>
    <Menu />
  </Router>,

  document.getElementById('root')
);

// ReactDOM.render(
//   <App />,
//   document.getElementById('root')
// )


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
