import './Waveform.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Wavesurfer from 'wavesurfer.js';


let wavesurfer = 0

function Waveform(props) {

    //display: 'wave' or 'spec'
    //url - url of audio to display

    //wave_height - integer height of display in px     default 100
    //style_options - css style options passed to the waveform container

    useEffect(() => {
        //triggers when any props change

        console.log('updated')

    }, [props])


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
        });

        wavesurfer.load(props.url)

    }

    return (
        <div class='waveform-container' id='wavesurfer-container' style={props.style_options? {...props.style_options} : null}>
            <script src = 'https://unpkg.com/wavesurfer.js'></script>

        </div>
    )
}

export default Waveform