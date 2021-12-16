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

// Sometimes required to allow axios to make post requests to django
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

//initialise
var wavesurfer = null;
var wavesurfer2 = null;

function Analysis() {

    const [ audioFile, setAudioFile ] = useState(null);
    const [ audioList, setAudioList ] = useState(0);

    function updateAudioList() {
        axios
        .get("/api/unprocessedaudios/")
        .then((res) => setAudioList(res))
        .catch((err) => console.log(err));
    }

    function handleAudioSelect(e) {
        let id = e.target.id;
        let audio = audioList.data.filter(audio=>audio.id==id)[0];
        console.log(id)
        console.log(audio)
        console.log('setting audio File:')
        console.log(audio.filedata)
        setAudioFile(audio.filedata);
        console.log('actual audio file:')
        console.log(audioFile)

        audioList.data.map(function(audio) {
            let htmlEl = document.getElementById(audio.id)
            if (audio.id == id) {
                console.log('selecting:')
                console.log(htmlEl)
                htmlEl.setAttribute('class', 'audio-select-file-selected')
            } else {
                htmlEl.setAttribute('class', 'audio-select-file')
            }
        })
    }

    function displayAudioSelect() {
        if (audioList) {
            return (
                <div className='audio-select'>
                    {audioList.data.map(function(audio) {
                        return (
                            <li id={audio.id}
                                class='audio-select-file'
                                onClick={(e)=>handleAudioSelect(e)}>
                                <div id='test' className='select-audio-title'>
                                    {audio.title}
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

    function playPauseButtons() {
        console.log('hello')

        return (
            <div>
                <br/>
                <button className='uploadbutton' onClick={function() {
                    if (wavesurfer != undefined) {
                        wavesurfer.playPause()
                    }
                }}>Play/Pause original</button>
                <button className='uploadbutton' onClick={function() {
                    if (wavesurfer2 != undefined) {
                        wavesurfer2.playPause()
                    }
                }}>Play/Pause denoised</button>
            </div>
        )
    }

    function updateWaveforms() {

        if (document.getElementById('original-waveform')) {
            var element = document.getElementById('original-waveform')
            element.remove()}
        if (document.getElementById('denoised-waveform')) {
            var element = document.getElementById('denoised-waveform')
            element.remove()
        }

        var domE1 = document.createElement("div");
        domE1.setAttribute('id', 'original-waveform')

        var domE2 = document.getElementById("waveform-container")
        domE2.appendChild(domE1)

        wavesurfer = Wavesurfer.create({
            container: '#original-waveform',
            height: 200,
            waveColor: 'black'
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

            wavesurfer2 = Wavesurfer.create({
                container: '#denoised-waveform',
                waveColor: 'green',
                height: 200,
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
                {displayAudioSelect()}
                {/* <canvas id='spectrogram-canvas' width='200' height='100'></canvas>
                {displaySpectrogram()} */}
            </div>            

            <button className='uploadbutton' onClick={()=>updateWaveforms()}>update</button>
            <button className='uploadbutton' onClick={()=>denoiseWaveform()}>de-noise</button>

            {playPauseButtons()}

            <script src = 'https://unpkg.com/wavesurfer.js'></script>

            <div id='waveform-container' className='audio-display'>
                {/* <div id = "original-waveform"></div>
                <div id = "denoised-waveform"></div> */}
            </div>

        </div>
    )
}

export default Analysis;