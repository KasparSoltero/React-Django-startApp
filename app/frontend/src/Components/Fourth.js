import axios, { Axios } from "axios";
import { useState, useEffect } from 'react';

// import random from math.random

import './Fourth.css'
import Waveform from './Waveform.js'

import SelectionList from './SelectionList.js'

function Fourth() {

    const [ waveform_data, setWaveformData ] = useState(null)

    const [ selected_item, setSelectedItem ] = useState(null)

    useEffect(() => {
        console.log('here')
    })


    function handleListSelection(item) {
        setSelectedItem(item)
        setWaveformData(item.object.filedata)
    }

    return (
        <div className='main-box'>
            <SelectionList 
                list_type='backend-data' 
                object={['Animal']}
                // selectable={true}
                updateSelected={handleListSelection}
                // display_audio={true}
                display_title={true}
                // style_options={{
                //     width: '40%',
                //     position: 'absolute',
                //     right: '0',
                //     top: '0',
                //     bottom: '0',
                // }}
            />
        </div>
    )
}

export default Fourth