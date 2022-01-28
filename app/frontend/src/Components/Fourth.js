import axios, { Axios } from "axios";
import { useState, useEffect } from 'react';

// import random from math.random

import './Fourth.css'
import waveform from './waveform.js'

import SelectionList from './SelectionList.js'

function Fourth() {

    const [ input, setInput ] = useState(0)
    const [ waveform_data, set_waveform_data ] = useState(null)


    function updateInput() {
        if (document.getElementById('testinput')) {
            var temp = document.getElementById('testinput').value
            temp = parseInt(temp)
            setInput(temp)
            
            set_waveform_data({
                'data': [50, 0, temp+1, 5, temp-1, 40, temp*2, 15, temp+10, 30, 25]
            })

        } else {
            console.log('here2')
        }
    }

    function testFunc() {
        const csrf = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
        console.log(csrf ? csrf.pop() : '')
    }



    return (
        <div className='main-box'>
            <SelectionList list_type='backend-data' object='AudioFile'/>
            {testFunc()}

            <br/>
            Input radius :
            <input className='test-input' type='number' id='testinput' onChange={()=>updateInput()}/>
            <br/>
            <br/>
            Input:  {input}
            <br/>
            Bar:    {waveform(waveform_data)}
        </div>
    )
}

export default Fourth