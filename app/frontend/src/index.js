import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { 
  Upload_Audio,
  Home,
  Analysis,
  Fourth,
  Menu
} from './Components/components';

ReactDOM.render(
  <Router>
    <Menu />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/upload-audio' element={<Upload_Audio />} />
      <Route path='/analysis' element={<Analysis />} />
      <Route path='/fourth' element={<Fourth />} />
    </Routes>
  </Router>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
