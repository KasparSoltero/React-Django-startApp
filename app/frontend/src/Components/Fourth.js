import axios, { Axios } from "axios";
import { useState, useEffect } from 'react';

// import random from math.random

import './Fourth.css'
import Waveform from './Waveform.js'

import SelectionList from './SelectionList.js'

function Fourth() {

    const [ waveform_data, setWaveformData ] = useState(null)

    const [ selected_item, setSelectedItem ] = useState(null)


    function handleListSelection(item) {
        setSelectedItem(item)
        setWaveformData(item.object.filedata)
    }

    return (
        <div className='main-box'>
            <SelectionList 
                list_type='backend-data' 
                object='audiofile' 
                selectable={true}
                updateSelected={handleListSelection}
                display_audio={true}
                display_title={true}
            />
            <Waveform 
                url={waveform_data}/>
        </div>
    )
}

export default Fourth