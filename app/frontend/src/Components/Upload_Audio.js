import { React, useState } from 'react';
import axios from "axios";
import './Upload_Audio.css'

// import Waveform from 'waveform-react';
import Waveform from 'react-audio-waveform';
import Wavesurfer from 'wavesurfer.js'

import SelectionList from './SelectionList.js'

import getCSRF from './getCSRF.js'
axios.defaults.headers.common["X-CSRFTOKEN"] = getCSRF();


function Upload_Audio() {

    function denoiseNewAudios() {
        //Denoise unprocessed audio files

        var denoise_button = document.getElementById('denoise')
        denoise_button.innerHTML = 'denoising...'
        denoise_button.className='process-audios-button denoising'

        const form =  new FormData();
        form.append('id', 'tomato')

        axios({
            method: 'post',
            url: 'denoise-new/',
            data: form
        }).then((response) => {
            console.log(response)
            denoise_button.innerHTML = 'Denoise New'
            denoise_button.className = 'process-audios-button'
        })
    }

    
    function convolveNewAudios() {
        //Convolve unprocessed audio files

        //get all audio files
        let form = (new FormData)
        form.append('model', 'AudioFile')
        form.append('return', 'list')
        form.append('add_related_models', 'audioclip')

        axios({
            method: 'post',
            url: 'get-model/',
            data: form
        }).then((response) => {
            let audio_files = response.data[0]
            let related_audioclips = response.data[1]
            //check if each one has been convolved
            for (let i=0; i<audio_files.length; i++) {
                if (related_audioclips[i] === '<QuerySet []>') {
                    //convolve if not
                    const form =  new FormData;
                    form.append('id', audio_files[i].id)

                    axios({
                        method: 'post',
                        url: '/convolve-audio/',
                        data: form
                    }).then((response) => {
                        console.log(response)
                    })
                }
            }
        })
    }


    function uploadFilesToDB() {
        //Send group of files to backend, which then uploads them one by one

        var uploadData = document.getElementById('file-input').files
        var numFiles = uploadData['length'];

        for (let i = 0; i<numFiles; i++) {
            const form = new FormData();
            form.append('title', uploadData[i].name)
            form.append('file', uploadData[i]);
            axios({
                method: 'post',
                url: 'upload-files/',
                data: form,
            }).then(
                (response) => console.log(response))
        }
    }


    return (
        <div className='main-box'>

            <div className='upload-button-container'>
                <div className='upload-audio-container-two' style={{backgroundColor:'var(--pastel-yellow)'}}>
                    <input name='file-input' type='file' id='file-input' multiple/>
                    <button id='upload-button' onClick={() => uploadFilesToDB()}>
                        Upload files
                    </button>
                </div>
            </div>
            <div className='upload-data-container'>
                <SelectionList 
                    list_type='backend-data' 
                    object={['AudioFile', 'AudioClip']}
                    // selectable={false}
                    // updateSelected={}
                    display_audio={true}
                    display_title={true}
                    style_options={{
                        width: '100%',
                        display: 'inline-block',
                        right: '0',
                        top: '40px',
                        bottom: '0px',
                    }}
                    display_data={{
                        bool: [{
                            data: 'denoised_filedata',
                            title: 'denoised',
                        }, {
                            data: 'use_as_ref',
                            title: 'ref',
                            // colors: ['rgb(100,0,200)','rgb(0,200,100)']
                        }],
                    }}
                />
            </div>

            <div className='process-audios-container'>
                <div className='upload-audio-container-two' style={{backgroundColor:'var(--pastel-magenta)'}}>
                    <button className='process-audios-button' onClick={()=>denoiseNewAudios()} id='denoise'>Denoise New</button>
                    <button className='process-audios-button' onClick={()=>convolveNewAudios()} id='convolve'>Convolve New</button>
                </div>
            </div>

        </div>
    )
}

export default Upload_Audio;