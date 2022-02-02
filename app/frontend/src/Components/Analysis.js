import './Analysis.css';

import { React, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Wavesurfer from 'wavesurfer.js';

import SelectionList from './SelectionList.js'
import Waveform from './Waveform.js'
import Highlights from './Highlights.js'

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

    const [ audioFile, setAudioFile ] = useState(null);
    const [ audioList, setAudioList ] = useState(0);

    const [ wavesurfer_ready, setWavesurferReady ] = useState(false);


    function handleAudioSelection(selection) {
        setAudioFile(selection.object)
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
                updateSelected={handleAudioSelection}
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
                        url={audioFile? (audioFile.denoisedFile? (isChrome? audioFile.filedata : audioFile.denoisedFile) : null) : null}
                        wave_height={150}
                        spec_height={'150px'}
                        style_options={{
                        }}
                    />
                    {audioFile ? <Highlights audioFile={audioFile}/> : <div/>}
                </div>
            </div>

        </div>
    )
}

export default Analysis;