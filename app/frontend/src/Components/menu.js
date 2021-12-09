import './menu.css'

import { Link } from 'react-router-dom';

function Menu() {
  return (
        <div className='main'>
        <div className='dropdown-button'>
            <button onClick={null}>Dropdown</button>
            <div className='dropdown-content'>
                <a href='/'>Home</a>
                <a href='/second'>2</a>
                <a href='/audio'>Audio</a>
                <a href='/fourth'>Testing functions</a>
                <a href='#'>5</a>
                <a href='#'>6</a>
            </div>
        </div>
        </div>
    );
}

export default Menu