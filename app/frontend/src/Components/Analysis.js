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

axios.defaults.headers.common["X-CSRFTOKEN"] = 'gPvOPnEwl4K7jFnYGucAwkW06M5RrJFRvEtwPMUNbylfnVsG0BOm5niJPd3COr9r';

//initialise
var original_wavesurfer = null;
var processed_wavesurfer = null;

const waveform_height = 200;

function Analysis() {

    const [ audioFile, setAudioFile ] = useState(null);
    const [ audioList, setAudioList ] = useState(0);

    const [ wavesurfer_ready, setWavesurferReady ] = useState(false);


    function updateAudioList() {
        axios
        .get("/api/unprocessedaudios/")
        .then((res) => setAudioList(res))
        .catch((err) => console.log(err));
    }


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


    function updateWaveforms() {

        if (audioFile && audioFile.denoisedFile && audioFile.id) {

            var sameid = false
            if (document.getElementById('original-waveform')) {
                var element = document.getElementById('original-waveform')
                if (element.audio_id == audioFile.id) {sameid = true}
            }

            if (!sameid) {

                if (document.getElementById('original-waveform')) {
                    var element = document.getElementById('original-waveform')
                    if (element.audio_id == audioFile.id) {console.log('same')}
    
                    element.remove()}
                if (document.getElementById('processed-waveform')) {
                    var element = document.getElementById('processed-waveform')
                    element.remove()
                }
    
                var originalWaveform = document.createElement("div");
                originalWaveform.setAttribute('id', 'original-waveform')
                originalWaveform.audio_id = audioFile.id
    
                var processedWaveform = document.createElement("div")//, { onClick: (e) => handleHighlightDrag(e)});
                processedWaveform.setAttribute('id', 'processed-waveform')
    
    
                var domE2 = document.getElementById("waveform-container")
                domE2.appendChild(originalWaveform)
                domE2.appendChild(processedWaveform)
    
                original_wavesurfer = new Wavesurfer.create({
                    container: '#original-waveform',
                    height: waveform_height,
                    waveColor: 'black'
                });
    
                if (original_wavesurfer) {
                    original_wavesurfer.load(audioFile.filedata)
                }
    
                processed_wavesurfer = new Wavesurfer.create({
                    container: '#processed-waveform',
                    height: 200,
                    waveColor: 'blue'
                })
        
                if (audioFile.denoisedFile) {
                    if (processed_wavesurfer) {
                        processed_wavesurfer.load(audioFile.denoisedFile)
                    }
                }
            }
        } else {
            console.log('no audio file selected')
        }
    }


    // function waveforminfo() {

    //     function highlightSelected() {
    //         if (selectedHighlight) {
    //             return (
    //                 <div>
    //                     selected highlight:__
    //                     {String(selectedHighlight.call) }
    //                 </div>
    //             )
    //         } else return <div>no highlight selected</div>
    //     }

    //     if (document.getElementsByClassName('highlight')[0]) {
    //         return (
    //             <div>{highlightSelected()}</div>
    //         )
    //     }
    // }


    return (
        <div className='main-box'>
            
            <SelectionList 
                list_type='backend-data' 
                object='audiofile' 
                selectable={true}
                updateSelected={handleAudioSelection}
                // display_audio={true}
                display_title={true}
                style_options={{
                    width: '20%',
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