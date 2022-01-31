import { React, useState } from 'react';
import axios from "axios";
import './Upload_Audio.css'

// import Waveform from 'waveform-react';
import Waveform from 'react-audio-waveform';
import Wavesurfer from 'wavesurfer.js'


function Upload_Audio() {

    
    // axios.defaults.headers.common["X-CSRFTOKEN"] = 'gPvOPnEwl4K7jFnYGucAwkW06M5RrJFRvEtwPMUNbylfnVsG0BOm5niJPd3COr9r';


    const [audioList, setAudioList] = useState(0);

    function denoiseNewAudios() {
        //Denoise unprocessed audio files

        if (audioList) {
            audioList.data.map(function(audio) {
                console.log(audio)
                if (!audio.denoisedFile) {
                    console.log('here')

                    const formdata =  new FormData();
                    formdata.append('id', audio.id)

                    axios({
                        method: 'post',
                        url: '/add-denoised',
                        data: formdata
                    }).then((response) => console.log(response))

                } else console.log('already processed')
            })
        }
    }


    function convolveNewAudios() {
        //Convolve unprocessed audio files

        if (audioList) {
            audioList.data.map(function(audio) {
                console.log('convolving audio file:')
                console.log(audio)
                // if (!audio.convolveFile) {
                //     console.log('here')

                const formdata =  new FormData();
                formdata.append('id', audio.id)

                axios({
                    method: 'post',
                    url: '/convolve-audio',
                    data: formdata
                }).then((response) => console.log(response))

                // } else console.log('already processed')
            })
        }
    }


    function uploadFilesToDB() {
        //Send group of files to backend, which then uploads them one by one

        var uploadData = document.getElementById('uploadFiles').files
        var numFiles = uploadData['length'];


        for (let i = 0; i<numFiles; i++) {
            const formdata = new FormData();
            formdata.append('title', uploadData[i].name)
            formdata.append('file', uploadData[i]);
            axios({
                method: 'post',
                url: '/uploadfiles',
                data: formdata,
            }).then(
                (response) => console.log(response))
        }

    }


    function uploadFilesasrefTemp() {
        var uploadData = document.getElementById('uploadFiles').files
        var numFiles = uploadData['length'];


        for (let i = 0; i<numFiles; i++) {
            const formdata = new FormData();
            formdata.append('title', uploadData[i].name)
            formdata.append('file', uploadData[i]);
            axios({
                method: 'post',
                url: '/add-reference-temp',
                data: formdata,
            }).then(
                (response) => console.log(response))
        }
    }


    function updateAudioList() {
        axios
        .get("/api/unprocessedaudios/")
        .then((response) => setAudioList(response))
        .catch((err) => console.log(err));
    }


    function displayAudioList() {
        if (audioList) {

            function isDenoised(audio) {
                console.log(audio)
                if (audio.denoisedFile) {
                    if (false) {
                        return 'convolved'
                    } else return 'denoised'
                } else return 'not-denoised'
            }
            return (
                <div className='audio-list'>
                    {audioList.data.map(function(audio) {
                        return (
                            <li id={audio.id}
                                class='audio-file'
                                >
                                <div id='test' className='audio-title'>
                                    {audio.title}
                                </div>
                                <div id='process-stage'>
                                    <div id={isDenoised(audio)}/>
                                </div>
                            </li>
                        )
                    })}
                </div>
            )
        } else return (
            <div>fetching audio list...</div>
        )
    }


    return (
        <div className='main-box'>
            ....testing file upload! <br/>
            
            <div className='audio-container'>
                <button onClick={()=>updateAudioList()}>. Refresh</button>
                <button onClick={()=>denoiseNewAudios()}>. Denoise</button>
                <button onClick={()=>convolveNewAudios()}>. Convolve</button>

                {displayAudioList()}
            </div>            

            <input name='uploadFiles' type='file' id='uploadFiles' multiple/>
            <button className='uploadbutton' onClick={() => uploadFilesToDB()}>
                Upload files to database!
            </button>
            <button className='uploadbutton' onClick={() => uploadFilesasrefTemp()}>
                Upload files as reference clips!
            </button>

        </div>
    )
}

export default Upload_Audio;