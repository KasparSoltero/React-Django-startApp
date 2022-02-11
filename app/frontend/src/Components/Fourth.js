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
            {/* <SelectionList 
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
            /> */}
            <DropDown
                id={'test'}
                model='animal'
                default={2}
                onSelect={onSelect}
                style_options={{
                    width: '200px',
                }}
            />
        </div>
    )
}

export default Fourth