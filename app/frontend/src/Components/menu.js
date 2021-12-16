import './menu.css'

import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Menu() {

    var path = window.location.href;
    const pages = document.getElementsByTagName('li')

    useEffect(() => {
        //highlights the current page in the menu bar
        for (let item of pages) {

            var link = item.getElementsByTagName('a')[0]

            if (link.href === path) {
                item.classList.add('current-page');
            }
            else {
                item.classList.remove('current-page');
            }
        }
    }, [path]) //only run useeffect if path changes

    
    return (
        <div className='menu-main'>
            <ul class='nav'>
                <li>
                    <a href='/'>Home</a>
                    <div className='select-bar'/>
                </li>
                <li>
                    <a href='/upload-audio'>Upload Audio</a>
                    <div className='select-bar'/>
                </li>
                <li>
                    <a href='/analysis'>Analysis</a>
                    <div className='select-bar'/>
                </li>
                <li>
                    <a href='/fourth'>Testing</a>
                    <div className='select-bar'/>
                </li>
            </ul>
        </div>
    );
}

export default Menu