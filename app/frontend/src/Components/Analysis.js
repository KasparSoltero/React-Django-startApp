import { React, useEffect, useState } from 'react';
import './Analysis.css';
import Sound from 'react-sound';
import { Spectrogram } from 'react-spectrogram';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player'
import Wavesurfer from 'wavesurfer.js';
import wav from 'audio-lena/wav';

var wavSpectro = require('wav-spectrogram');

const decode = require('audio-decode');
const buffer = require('audio-lena/wav');

// Sometimes required to allow axios to make post requests to django
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

//initialise
var original_wavesurfer = null;
var processed_wavesurfer = null;

const waveform_height = 200;

function Analysis() {

    const [ audioFile, setAudioFile ] = useState(null);
    const [ audioList, setAudioList ] = useState(0);

    //things for highlight selection / editing, should move to different script
    const [ selectedHighlight, setSelectedHighlight ] = useState(null);
    const [ isDragging, setIsDragging] = useState(false);
    const [ xInitial, setXInitial ] = useState(null)
    const [ xPos, setXPos ] = useState(null);
    const [ highlightXInitial, setHighlightXInitial ] = useState(null);
    const [ draggingLeft, setDraggingLeft ] = useState(null)
    const [ highlightWidthInitial, setHighlightWidthInitial ] = useState(null)


    function updateAudioList() {
        axios
        .get("/api/unprocessedaudios/")
        .then((res) => setAudioList(res))
        .catch((err) => console.log(err));
    }


    function handleAudioSelect(e) {
        // adjusts the values of global 'audioFile' and 'audioList' variables
        let id = e.target.id;
        let audio = audioList.data.filter(audio=>audio.id==id)[0];
        setAudioFile(audio);

        audioList.data.map(function(audio) {
            let htmlEl = document.getElementById(audio.id)
            if (audio.id == id) {
                // console.log('selecting:')
                // console.log(htmlEl)
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

        return (
            <div>
                <br/>
                <button className='uploadbutton' onClick={function() {
                    if (original_wavesurfer != undefined) {
                        original_wavesurfer.playPause()
                    }
                }}>Play/Pause original</button>
                <button className='uploadbutton' onClick={function() {
                    if (processed_wavesurfer != undefined) {
                        processed_wavesurfer.playPause()
                    }
                }}>Play/Pause denoised</button>
            </div>
        )
    }


    function updateWaveforms() {

        if (audioFile && audioFile.denoisedFile && audioFile.id) {

            var sameid = false
            if (document.getElementById('original-waveform')) {
                var element = document.getElementById('original-waveform')
                if (element.audio_id == audioFile.id) {sameid = true}
            }

            if (!sameid) {
                setSelectedHighlight(null)

                if (document.getElementById('original-waveform')) {
                    var element = document.getElementById('original-waveform')
                    if (element.audio_id == audioFile.id) {console.log('same')}
    
                    element.remove()}
                if (document.getElementById('processed-waveform')) {
                    var element = document.getElementById('processed-waveform')
                    element.remove()
                }
    
                var originalWaveform = document.createElement("div");
                originalWaveform.setAttribute('id', 'original-waveform')
                originalWaveform.audio_id = audioFile.id
    
                var processedWaveform = document.createElement("div")//, { onClick: (e) => handleHighlightDrag(e)});
                processedWaveform.setAttribute('id', 'processed-waveform')
    
    
                var domE2 = document.getElementById("waveform-container")
                domE2.appendChild(originalWaveform)
                domE2.appendChild(processedWaveform)
    
                original_wavesurfer = new Wavesurfer.create({
                    container: '#original-waveform',
                    height: waveform_height,
                    waveColor: 'black'
                });
    
                if (original_wavesurfer) {
                    original_wavesurfer.load(audioFile.filedata)
                }
    
                processed_wavesurfer = new Wavesurfer.create({
                    container: '#processed-waveform',
                    height: 200,
                    waveColor: 'blue'
                })
        
                if (audioFile.denoisedFile) {
                    if (processed_wavesurfer) {
                        processed_wavesurfer.load(audioFile.denoisedFile)
                    }
                }
            }
        } else {
            console.log('no audio file selected')
        }
    }


    function addSections() {
        if(document.getElementById('processed-waveform') && audioFile) {

            if (!document.getElementsByClassName('highlight')[0]) {

                const formdata = new FormData()
                formdata.append('id', audioFile.id)

                axios({
                    method: 'post',
                    url: '/get-related-noiseclips/',
                    data: formdata
                }).then(function(response) {

                    const start = []
                    const end = []
                    const ids = []
                    const duration = parseFloat(audioFile.duration)

                    for(let i=0;i<response.data.length;i++) {
                        start.push(parseFloat(response.data[i]['startTime']))
                        end.push(parseFloat(response.data[i]['endTime']))
                        ids.push(response.data[i]['id'])
                    }
                    for (let i=0;i<start.length;i++) {
                        var highlight = document.createElement("div")
                        highlight.className = 'highlight'

                        let color = response.data[i]['color']
                        console.log(color)
            
                        var wave = document.getElementById('processed-waveform')
                        wave.appendChild(highlight)

                        let relStart = Math.round(100*start[i] / duration)
                        let relEnd = Math.round(100*end[i]/duration)

                        highlight.style.width = String(relEnd-relStart) + "%";
                        highlight.style.height = '100px';
                        highlight.style.backgroundColor = color;
                        highlight.style.marginLeft = String(relStart) + "%";
                        highlight.style.marginTop = String(-(waveform_height+100)/2)+'px'; //100 should be driven by marginTop
                        highlight.style.marginBottom = '50px'; //should be driven, diff between marginTop and height
                        highlight.style.position = 'relative'; //required to bring highlight to front of page
                        highlight.highlight_id = ids[i]

                        highlight.call = response.data[i]['referenceTitle']
                        console.log('here')
                        console.log(response.data[i]['referenceTitle'])
                    }
                })
            }
        }
    }


    function updateHighlight() {
        // edit highlight's stored times in the database based on the user's edits

        let hl = selectedHighlight

        const duration = parseFloat(audioFile.duration)

        let newStart = Math.round(100*duration *  hl.offsetLeft / hl.offsetParent.offsetWidth) / 100
        let newEnd = Math.round(100*duration * (hl.offsetWidth + hl.offsetLeft) / hl.offsetParent.offsetWidth) / 100

        let formdata = new FormData
        formdata.append('id', selectedHighlight.highlight_id)
        formdata.append('start', newStart)
        formdata.append('end', newEnd)

        axios({
            method: 'post',
            url: '/update-highlight/',
            data: formdata
        }).then((response) => {
            console.log(response)
        })
    }


    function handleHighlightSelect(e) {

        function changeAlpha(color, newAlpha) {
            //takes rgba(a,b,c,d) color and alters alpha value

            let split = color.split(',')
            return(split[0]+','+split[1]+','+split[2]+','+String(newAlpha)+')')
        }

        //deselect other clips
        let hls = document.getElementsByClassName('highlight')
        for (let hl of hls) {
            if (!(hl == e.target)) {
                hl.style.backgroundColor = changeAlpha(hl.style.backgroundColor, 0.5)
            }
        }

        //deselect or change selected highlight clip
        let hl = e.target
        if (!(hl == selectedHighlight)) {
            hl.style.backgroundColor = changeAlpha(hl.style.backgroundColor, 0.8)
            setSelectedHighlight(hl)
        } else {
            hl.style.backgroundColor = changeAlpha(hl.style.backgroundColor, 0.5)
            setSelectedHighlight(null)
        }
    }


    function handleMouseDown(e) {
        if ((e.target.className == 'highlight') && selectedHighlight) {
            //initial x position for dragging
            if (xInitial == null) {
                setXInitial(e.pageX)
                setHighlightXInitial(selectedHighlight.offsetLeft)
                setHighlightWidthInitial(selectedHighlight.offsetWidth)
            }
            handleHighlightDrag(e)
        }
    }


    function handleHighlightDrag(e) {
        
        setIsDragging(true)

        let mouse = e.pageX - selectedHighlight.offsetParent.offsetLeft
        let left = selectedHighlight.offsetLeft
        let right = selectedHighlight.offsetLeft + selectedHighlight.offsetWidth

        //drag either left or right side of highlight, depending on which side is closer
        if (Math.abs(mouse - left) > Math.abs(right - mouse)) {
            setDraggingLeft(false)
        } else setDraggingLeft(true)
    }


    function handleMouseUp(e) {
        if (!(xInitial) || (xInitial==e.pageX)) {// if mouse did not move between mousedown & mouseup
            
            if (e.target.className == 'highlight') {
                handleHighlightSelect(e)
            }
            setIsDragging(false)

        } else if (isDragging) { // if mouse was dragging

            setIsDragging(false)
            setXPos(null)
            setDraggingLeft(null)

            updateHighlight()
        }
        setXInitial(null)
        setHighlightXInitial(null)
        setHighlightWidthInitial(null)

    }


    function handlePointerMove(e) {
        if (isDragging && xInitial) {

            setXPos(e.pageX - xInitial)
            if (draggingLeft == true) {
                selectedHighlight.style.marginLeft = String(highlightXInitial + xPos) + 'px'
                selectedHighlight.style.width = String(highlightWidthInitial - xPos) + 'px'
            } else if (draggingLeft == false) {
                selectedHighlight.style.width = String(highlightWidthInitial + xPos) + 'px'
            }
            console.log(xPos)
            console.log(selectedHighlight.style.width)
        }
    }


    function waveforminfo() {

        function highlightSelected() {
            if (selectedHighlight) {
                return (
                    <div>
                        selected highlight:__
                        {String(selectedHighlight.call) }
                    </div>
                )
            } else return <div>no highlight selected</div>
        }

        if (document.getElementsByClassName('highlight')[0]) {
            return (
                <div>{highlightSelected()}</div>
            )
        }
    }


    function refreshTemp() {
        updateWaveforms()
    }

    function refreshTemp2() {
        updateAudioList()
    }

    return (
        <div className='main-box'>
            
            <div className='select-audio-container' onClick={()=>refreshTemp2()}>
                Select audio file.
                {displayAudioSelect()}
            </div>            

            {playPauseButtons()}

            <script src = 'https://unpkg.com/wavesurfer.js'></script>

            <div id='waveform-container' className='audio-display' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onPointerMove={handlePointerMove} onClick={()=>refreshTemp()}>
                {addSections()}

                <div id='waveform-info'>{waveforminfo()}</div>
            </div>
        </div>
    )
}

export default Analysis;