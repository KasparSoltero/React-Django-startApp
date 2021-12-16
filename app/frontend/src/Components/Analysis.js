import { React, useEffect, useState } from 'react';
import './Analysis.css';
import Sound from 'react-sound';
import { Spectrogram } from 'react-spectrogram';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player'
import Wavesurfer from 'wavesurfer.js';

var wavSpectro = require('wav-spectrogram');

const decode = require('audio-decode');
const buffer = require('audio-lena/wav');

// Required to allow axios to make post requests to django
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

function Analysis() {

    const [ audioFile, setAudioFile ] = useState(null);
    const [ audioList, setAudioList ] = useState(0);

    function updateAudioList() {
        axios
        .get("/api/unprocessedaudios/")
        .then((res) => setAudioList(res))
        .catch((err) => console.log(err));
    }

    function handleInputChange(e) {
        setAudioFile(e.target.value)
    }

    function displayAudioSelect() {
        if (audioList) {

            let selectAudioContainer = document.getElementsByClassName('select-audio-container')[0]

            //clear list
            let elremove = document.querySelectorAll('div.audio-in-list')
            for (let el of elremove) {
                el.remove()
            }

            //create list from files in audioList
            audioList.data.map(function(file) {
                console.log(file.title)

                
                let listEl = document.createElement('div');

                listEl.setAttribute('class', 'audio-in-list');
                listEl.innerHTML += file.title
                // tempListElement.setAttribute('onClick', "{ setAudioFile(file.filedata) }")

                // tempListElement.setAttribute('onClick', setAudioFile(file.filedata))
                
                // selectAudioContainer.appendChild(tempListElement)

            })

            return (

                

                <select value={audioFile} onChange={handleInputChange} multiple>
                    {audioList.data.map((file)=>(
                        <option value={file.filedata}>{file.title}</option>
                    ))}
                </select>
            )
        } else return (
            <div>fetching audio list...</div>
        )
    }

    const Spectrogram = 0;

    var arrayBuffer = 0;

    function updateWaveforms() {

        if (document.getElementById('original-waveform')) {
            var element = document.getElementById('original-waveform')
            element.remove()
            var element = document.getElementById('denoised-waveform')
            element.remove()
        }

        var domE1 = document.createElement("div");
        domE1.setAttribute('id', 'original-waveform')

        var domE2 = document.getElementById("waveform-container")
        domE2.appendChild(domE1)

        var wavesurfer = Wavesurfer.create({
            container: '#original-waveform'
        });

        if (audioFile) {
            if (wavesurfer) {
                wavesurfer.load(audioFile)
            }
        } else {
            console.log('no audio file selected')
        }
    }

    function denoiseWaveform() {

        //denoise the selected waveform
        const formdata = new FormData();

        formdata.append('url', audioFile)

        axios({
            method: 'post',
            url: '/get-denoised/',
            data: formdata
        }).then(function(res) 
        {
            console.log(res)
            //create waveform display
            if (document.getElementById('denoised-waveform')) {
                var element = document.getElementById('denoised-waveform')
                element.remove()
            }

            var domE1 = document.createElement("div");
            domE1.setAttribute('id', 'denoised-waveform')

            var domE2 = document.getElementById("waveform-container")
            domE2.appendChild(domE1)

            var wavesurfer2 = Wavesurfer.create({
                container: '#denoised-waveform',
                waveColor: 'red',
                height: 100,
                barHeight: 100
            });
            
            var temp = 0

            updateAudioList()

            audioList.data.forEach(function(data) {
                if (data.title === 'denoised_temp') {
                    temp = data.filedata
                    console.log(data.title)
                }
            })

            if (audioFile) {
                if (wavesurfer2) {
                    wavesurfer2.load(temp)
                }
            } else {
                console.log('no audio file selected')
            }
        }
        ).catch(
            (err)=>(console.log(err))
        );
    }

    function displaySpectrogram() {

        if (audioFile) {

            // reader.readAsArrayBuffer(audioFile)
            return (
                // <audio src={audioFile} controls></audio>
                <div/>
            )
        } else return <div>fetching audio list...</div>
    }

    return (
        <div className='main-box'>
            Testing audio / Spectrogram display...
            
            <div className='select-audio-container'>
                Select audio file.
                <button onClick={()=>updateAudioList()}>. Refresh</button>
                <br/>
                {displayAudioSelect()}
                {/* <canvas id='spectrogram-canvas' width='200' height='100'></canvas>
                {displaySpectrogram()} */}
            </div>            

            <button className='uploadbutton' onClick={()=>updateWaveforms()}>update</button>
            <button className='uploadbutton' onClick={()=>denoiseWaveform()}>de-noise</button>


            <script src = 'https://unpkg.com/wavesurfer.js'></script>

            <div id='waveform-container' className='audio-display'>
                {/* <div id = "original-waveform"></div>
                <div id = "denoised-waveform"></div> */}
            </div>

        </div>
    )
}

export default Analysis;