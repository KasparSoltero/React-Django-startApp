import './Analysis.css';

import { useEffect, useState } from 'react';
import axios from 'axios';

import SelectionList from './SelectionList.js'
import Waveform from './Waveform.js'
import Highlights from './Highlights.js'
import ObjectDataPanel from './ObjectDataPanel.js'
import MultipleObjectDataPanel from './MultipleObjectDataPanel.js'

import { isChrome } from 'react-device-detect';

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

    const [ update_var, setUpdateVar ] = useState(false)


    function handleAudioSelection(selection) {
        setAudioFile(selection.object)
    }


    function handleHighlightSelection(selection) {
        if (selection.html_selected) {
            const form = new FormData
            form.append('return', 'single')
            form.append('model', 'AudioClip')
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


    function refreshWaveforms() {
        setUpdateVar(!update_var)
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
                        //if chrome is used, visuals are generated from original audio, else from denoised audio
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
                            update_var={update_var}
                        /> : <div/>}
                </div>
                {selected_audio_clip ? 
                    <ObjectDataPanel
                        object = {selected_audio_clip}
                        keys = {['title', 'start_time', 'end_time', 'use_as_ref', 'animal']}
                        mutable = {true}
                        onDataUpdate = {refreshWaveforms}
                        style_options={{
                            // backgroundColor: 'rgb(0,255,0)'
                        }}
                    /> : <div/>}
            </div>

            <MultipleObjectDataPanel
                model='animal'
                keys={['color']}
            />

        </div>
    )
}

export default Analysis;