import './Waveform.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

import Wavesurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js';

let wavesurfer

function Waveform(props) {

    //display: 'wave' or 'spec'
    //url - url of audio to display

    //wave_height - integer height of display in px     default 100
    //style_options - css style options passed to the waveform container


    // chrome can't open the denoised files saved by django for some reason

    useEffect(() => {
        //triggers when selected audio changes

        if (props.url) {updateWavesurfer()}

    }, [props.url])


    function updateWavesurfer() {

        console.log('updating wavesurfers')
        
        if (wavesurfer) {wavesurfer.destroy()}
        
        wavesurfer = new Wavesurfer.create({
            container: '#wavesurfer-container',
            height: props.wave_height? props.wave_height : 100,
            waveColor: 'black',
            normalize: true,

            // plugins: props.display==='spec'? [
            //     SpectrogramPlugin.create({
            //         wavesurfer: wavesurfer,
            //         container: '#wavesurfer-container',
            //         labels: true,
            //     })
            // ] : null
        });

        wavesurfer.load(props.url)
    }

    return (
        <div class='waveform-container' id='wavesurfer-container' style={props.style_options? {...props.style_options} : null}>
            <script src = 'https://unpkg.com/wavesurfer.js'></script>
            <div id='test-denoised' style={{backgroundColor: 'rgb(100,0,0)'}}></div>
        </div>
    )
}

export default Waveform