import './Waveform.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

import Wavesurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js';
// import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';

const colormap = require('colormap');

let wavesurfer

const colors = colormap({
    colormap: 'plasma',
    nshades: 256,
    format: 'float'
});

function Waveform(props) {

    //display: 'wave' or 'spec'
    //filedata - url of audio to display

    //wave_height - integer height of display in px     default 100
    //style_options - css style options passed to the waveform container

    // chrome can't open the denoised files saved by django for some reason

    useEffect(() => {
        //triggers when selected audio changes

        if (props.filedata) {
            updateWavesurfer()
        }

    }, [props.filedata])


    function updateWavesurfer() {
        
        if (wavesurfer) {wavesurfer.destroy()}
        
        wavesurfer = new Wavesurfer.create({
            container: '#wave',
            height: props.height? props.height : 100,
            waveColor: 'black',
            normalize: true,

            plugins: [
                SpectrogramPlugin.create({
                    wavesurfer: wavesurfer,
                    container: '#spec',
                    labels: false,
                    colorMap: colors,
                    style: {
                        position: 'fixed',
                    }
                }),
                TimelinePlugin.create({
                    container:"#timeline"
                })
            ]
        });

        wavesurfer.on('ready', function () {
            

            //adjust spectrogram layout to display correctly
            if (document.getElementsByTagName('spectrogram')[0]) {
                let sg = document.getElementsByTagName('spectrogram')[0]

                sg.style.overflow = 'unset'
                sg.style.width = '0'
                sg.style.position = 'relative'
                sg.style.marginTop = '10px'

                //height of spectrogram element is adjusted if provided
                if (props.spec_height) {sg.style.height = props.spec_height}
                for (let child of sg.children) {
                    if (props.spec_height) {
                        child.style.height = props.spec_height
                    }
                }
            }

            //call provided callOnReady function
            if (props.callOnReady) {props.callOnReady(wavesurfer)}
        })
        
        wavesurfer.load(props.filedata)
    }

    function handleWaveClick(e) {
        if (props.highlight_tool) {

            var form = new FormData
            form.append('parent_id', props.audio_file.id)
            form.append('title', 'new_clip')

            axios({
                method: 'post',
                url: 'temp-create-highlight/',
                data: form,
            }).then((response)=>{
                props.onHighlightCreate()
                console.log(response)
            })
        }
    }

    if (props.filedata) {return (
        <div style={props.style_options? {...props.style_options} : null}>
            <div id='wave' onClick={(e)=>handleWaveClick(e)}/>
            <div id='spec'/>
            <div id='timeline'/>
        </div>
    )} else return <div/>
}

export default Waveform