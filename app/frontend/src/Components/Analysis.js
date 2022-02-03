import './Analysis.css';

import { React, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Wavesurfer from 'wavesurfer.js';

import SelectionList from './SelectionList.js'
import Waveform from './Waveform.js'
import Highlights from './Highlights.js'
import ObjectDataPanel from './ObjectDataPanel.js'

// import isChrome from 'react-device-detect'
import { isChrome } from 'react-device-detect';

//// currently unused packages:
// import ReactAudioPlayer from 'react-audio-player'
// var wavSpectro = require('wav-spectrogram');
// import Sound from 'react-sound';
// import { Spectrogram } from 'react-spectrogram';

import getCSRF from './getCSRF.js'
axios.defaults.headers.common["X-CSRFTOKEN"] = getCSRF();

//initialise
var original_wavesurfer = null;
var processed_wavesurfer = null;

const waveform_height = 200;

function Analysis() {

    const [ audio_file, setAudioFile ] = useState(null);
    const [ audio_list, setAudioList ] = useState(0);

    const [ selected_audio_clip, setSelectedAudioClip ] = useState(null)


    function handleAudioSelection(selection) {
        setAudioFile(selection.object)
    }


    function handleHighlightSelection(selection) {
        if (selection.html_selected) {
            const form = new FormData
            form.append('return', 'single')
            form.append('object', 'AudioClip')
            form.append('id', selection.object_id)

            axios({
                method: 'post',
                url: 'get-model/',
                data: form,
            }).then((response)=>{
                setSelectedAudioClip(response.data[0])
            })
        } else {
            setSelectedAudioClip(null)
        }
    }



    function playPauseButtons() {

        return (
            <div>
                <button className='playpausebutton' onClick={function() {
                    if (original_wavesurfer != undefined) {
                        original_wavesurfer.playPause()
                    }
                }}>Play/Pause original</button>
                <button className='playpausebutton' onClick={function() {
                    if (processed_wavesurfer != undefined) {
                        processed_wavesurfer.playPause()
                    }
                }}>Play/Pause denoised</button>
            </div>
        )
    }


    return (
        <div className='main-box'>
            
            <SelectionList 
                list_type='backend-data' 
                object={['audiofile']}
                selectable={true}
                onSelect={handleAudioSelection}
                // display_audio={true}
                display_title={true}
                style_options={{
                    width: '20%',
                    height: '100%',
                }}
            />

            {/* {playPauseButtons()} */}

            <div className='analyse-audio-container'>
                <div className='wavesurfer-container'>
                    <Waveform 
                        spectrogram={true}
                        //if chrome is used, visuals are generated from original audio
                        filedata={audio_file? (audio_file.denoised_filedata? (isChrome? audio_file.filedata : audio_file.denoised_filedata) : null) : null}
                        wave_height={150}
                        spec_height={'150px'}
                        style_options={{
                        }}
                    />
                    {audio_file ? 
                        <Highlights 
                            audio_file={audio_file}
                            onSelect={handleHighlightSelection}
                        /> : <div/>}
                </div>
                {selected_audio_clip ? 
                    <ObjectDataPanel
                        object = {selected_audio_clip}
                        style_options={{
                            // backgroundColor: 'rgb(0,255,0)'
                        }}
                    /> : <div/>}
            </div>

        </div>
    )
}

export default Analysis;