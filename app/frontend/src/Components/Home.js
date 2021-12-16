import logo from '../logo.svg';
import './Home.css';
import Menu from './menu';

import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `count: ${count}`;
  });

  return (
    <div className='header'>
      Example to learn useEffect and useState
      <p>Click to increase count: {count}</p>
      <button onClick={() => setCount(count+1)}>
        Click me
      </button>
    </div>
  );
}

function Home() {

  return (
    <div className="main-box">
      <h1>Home page</h1>
    </div>
  );
}

export default Home;
