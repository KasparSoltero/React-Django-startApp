import './Analysis.css';

import { useEffect, useState } from 'react';
import axios from 'axios';

import SelectionList from './SelectionList.js'
import Waveform from './Waveform.js'
import Highlights from './Highlights.js'
import ObjectDataPanel from './ObjectDataPanel.js'
import MultipleObjectDataPanel from './MultipleObjectDataPanel.js'
import Toolbar from './Toolbar'
import GlobalDataPanel from './GlobalDataPanel.js'

import { isChrome } from 'react-device-detect';

import getCSRF from './getCSRF.js'
axios.defaults.headers.common["X-CSRFTOKEN"] = getCSRF();



function Analysis() {

    const [ audio_file, setAudioFile ] = useState(null);

    const [ wavesurfer, setWavesurfer ] = useState(null);

    const [ selected_audio_clip, setSelectedAudioClip ] = useState(null)

    const [ update_data_panel, setUpdateDataPanel ] = useState(false)

    const [ update_highlights, setUpdateHighlights ] = useState(false)
    const [ highlight_tool, setHighlightTool ] = useState(false)

    function handleAudioSelection(selection) {
        setAudioFile(()=>selection.object)
    }

    function sendWavesurfer(wavesurfer) {
        setWavesurfer(wavesurfer)
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
                setSelectedAudioClip(()=>response.data[0])
            })
        } else {
            setSelectedAudioClip(()=>null)
        }
    }


    function handleHighlightSave(object_id) {
        const form = new FormData
        form.append('return', 'single')
        form.append('model', 'AudioClip')
        form.append('id', object_id)

        axios({
            method: 'post',
            url: 'get-model/',
            data: form,
        }).then((response)=>{
            setSelectedAudioClip(()=>response.data[0])
            setUpdateDataPanel((update_data_panel)=>!update_data_panel)
        })
    }

    function updateHighlights() {
        setUpdateHighlights((update_highlights)=>!update_highlights)
    }

    function handleKeyDown(e) {
        if (e.code==="Backspace") {
            if (selected_audio_clip) {
                //delete selected audio clip on backspace key press
                let form = new FormData
                form.append('model', 'audioclip')
                form.append('id', selected_audio_clip.id)
                axios({
                    method: 'post',
                    url: 'delete-object/',
                    data: form,
                }).then((response)=>{
                    console.log(response)
                })
                setUpdateHighlights((update_highlights)=>!update_highlights)
                setUpdateDataPanel((update_data_panel)=>!update_data_panel)
            }
        }
    }


    useEffect(() => {
        console.log(highlight_tool)
    }, [highlight_tool])

    return (
        <div className='main-box' onKeyDown={(e)=>handleKeyDown(e)} tabIndex="-1">
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

            <div className='analyse-audio-container'>
                <Toolbar
                    wavesurfer={wavesurfer}
                    playpause={true}
                    highlights={true}
                    highlight_tool={highlight_tool}
                    setHighlightTool={setHighlightTool}
                />
                <div className='wavesurfer-container'>
                    <Waveform
                        spectrogram={true}
                        audio_file={audio_file}
                        //if chrome is used, visuals are generated from original audio, else from denoised audio
                        filedata={audio_file? (audio_file.denoised_filedata? (isChrome? audio_file.filedata : audio_file.denoised_filedata) : null) : null}
                        wave_height={150}
                        spec_height={'150px'}
                        style_options={{
                        }}
                        callOnReady={sendWavesurfer}
                        highlight_tool={highlight_tool}
                        onHighlightCreate={updateHighlights}
                    />
                    {audio_file ? 
                        <Highlights
                            audio_file={audio_file}
                            onSelect={handleHighlightSelection}
                            onHighlightSave={handleHighlightSave}
                            update_prop={update_highlights}
                        /> : <div/>}
                </div>
                {selected_audio_clip ? 
                    <ObjectDataPanel
                        object = {selected_audio_clip}
                        keys = {['title', 'start_time', 'end_time', 'use_as_ref', 'animal']}
                        mutable = {true}
                        style_options={{
                            width: '50%',
                            height: 'calc(45px * 5 + 16px)',
                        }}
                        update_prop = {update_data_panel}
                        onDataUpdate = {updateHighlights}
                    /> : <div/>}
                <GlobalDataPanel
                    prop = 'none'
                />
            </div>

            <MultipleObjectDataPanel
                model='animal'
                keys={['color']}
                style_options={{
                    width: 'calc(20% - 40px + 18px)',
                }}
            />

        </div>
    )
}

export default Analysis;