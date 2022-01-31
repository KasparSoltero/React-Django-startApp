import './Waveform.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

import Wavesurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js';

const colormap = require('colormap');

let wavesurfer

const colors = colormap({
    colormap: 'plasma',
    nshades: 256,
    format: 'float'
});

function Waveform(props) {

    //display: 'wave' or 'spec'
    //url - url of audio to display

    //wave_height - integer height of display in px     default 100
    //style_options - css style options passed to the waveform container


    // chrome can't open the denoised files saved by django for some reason

    useEffect(() => {
        //triggers when selected audio changes

        if (props.url) {
            updateWavesurfer()
        }

    }, [props.url])


    function updateWavesurfer() {

        console.log('updating wavesurfers')
        
        if (wavesurfer) {wavesurfer.destroy()}
        
        wavesurfer = new Wavesurfer.create({
            container: '#wave',
            height: props.height? props.height : 100,
            waveColor: 'black',
            normalize: true,

            plugins: props.spectrogram ? [
                SpectrogramPlugin.create({
                    wavesurfer: wavesurfer,
                    container: '#spec',
                    labels: false,
                    colorMap: colors,
                    style: {
                        position: 'fixed',
                    }
                })
            ] : []
        });

        wavesurfer.on('ready', function () {
            //adjust wavesurfer properties after generating waveform
            
            //adjust spectrogram layout
            if (props.spectrogram) {
                if (document.getElementsByTagName('spectrogram')[0]) {
                    let sg = document.getElementsByTagName('spectrogram')[0]
                    sg.style.overflow = 'unset'
                    sg.style.display = 'block'
                    sg.style.width = '0'
                    sg.style.position = 'relative'
                    sg.style.marginTop = '10px'

                    for (let child of sg.children) {
                        if (props.spec_height) {
                            child.style.height = props.spec_height
                        }
                    }
                }
            }
        })
        
        wavesurfer.load(props.url)
    }

    if (props.url) {return (
        <div className='wavesurfer-container' style={props.style_options? {...props.style_options} : null}>
            <div id='wave'/>
            <div id='spec'/>
        </div>
    )} else return <div className='invisible'/>
}

export default Waveform