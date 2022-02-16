import './Fourth.css'

import axios, { Axios } from "axios";
import { useState, useEffect } from 'react';

import SelectionList from './SelectionList.js'
import DropDown from './DropDown.js'

function Fourth() {

    const [ waveform_data, setWaveformData ] = useState(null)

    const [ selected_item, setSelectedItem ] = useState(null)


    function handleListSelection(item) {
        setSelectedItem(item)
        setWaveformData(item.object.filedata)
    }

    function onSelect(x) {
        console.log(x)
    }

    return (
        <div className='main-box'>
           <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 12 12">

<title>Carrot SVG</title>

<desc>This is an example of an SVG file with a carrot.</desc>

<defs>

<rect width="6" height="6" fill="#f6dede"/>

</defs>

<g>

<circle cx="6" cy="6" r="3" fill="#527ce7"/>

<path d="M3,6 L9,6 L3,0" fill="#527ce7"/>

</g>

</svg>
        </div>
    )
}

export default Fourth