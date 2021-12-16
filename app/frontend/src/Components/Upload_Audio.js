import { React, useState } from 'react';
import axios from "axios";
import './Upload_Audio.css'

// import Waveform from 'waveform-react';
import Waveform from 'react-audio-waveform';
import Wavesurfer from 'wavesurfer.js'

function Upload_Audio() {

    const [audioFile, setAudioFile] = useState(0);
    const [audioList, setAudioList] = useState(0);
    const [ output, setOutput ] = useState(0);

    const [ audioUrls, setAudioUrls ] = useState(0);

    function updateAudioList() {
        //list of audio files in integer form are retrieved from the database

        // axios({
        //     method: 'get',
        //     url: '/retrieve-audio/',
        // }).then(
        //     //returned as a string like: [file_1.wav, [0,1,2,3,4,5,6]][file_2.wav, [7,8,9,10,11,12]]
        //     (response)=>setAudioList(response.data)
        // ).catch(
        //     (err)=>console.log(err))

        axios
            .get('api/unprocessedaudios/')
            .then((res)=>setAudioUrls(res.data))
            .catch((err)=>console.log(err))
        
        {displayAudioList()}

    }

    function displayAudioList() {

        if (audioUrls) {
            
            // var listAudio = []

            // var temp = audioList.slice(1, audioList.length-1).split('][')
            // temp.forEach(element => listAudio.push(element.split("', ")))
            
            // // signal is sent by database as a string, have to change it to a JS array
            // for (var i=0; i < listAudio.length; i++) {

            //     var intArray = listAudio[i][1]
            //         .slice(1, listAudio[i][1].length-1)
            //         .split(',')
            //         .map(item => parseInt(item));
                
            //     listAudio[i][1] = intArray
            // }
            // console.log(listAudio)

            var wavesurfer = Wavesurfer.create({
                container: '#waveform2',
                interact: true,
                mediaControls: true
                
            })

            console.log(audioUrls)
            audioUrls.forEach((audioUrl)=>console.log(audioUrl['filedata']))
            wavesurfer.load(audioUrls[0]['filedata'])

            return (
                <div className='AudioList'>
                    
                </div>
            )
        }        
    }

    function addFileToObjects() {
        //Construct file object from uploaded file and send it to database

        var audioFile = document.getElementById('uploadFile').files[0];
        var filename = document.getElementById('uploadFile').files[0].name;

        const formdata = new FormData();
        formdata.append('title', filename)
        formdata.append('file', audioFile)
        
        axios({
            method: 'post',
            url: '/uploadfiles/',
            data: formdata,
            }).then(
            (response)=>setOutput(response.data));
    }

    return (
        <div className='main-box'>
            ....testing file upload! <br/>
            
            <div className='AudioList-container'>
                List of 'file' objects in database: 
                <button onClick={()=>updateAudioList()}>. Refresh</button>
                <br/>
                <script src = 'https://unpkg.com/wavesurfer.js'></script>
                <div id='waveform2'></div>
                
            </div>

            <input name='uploadFile' type='file' id='uploadFile' />
            <button className='uploadbutton' onClick={() => addFileToObjects()}>
                Upload file to database
            </button>

        </div>
    )
}

export default Upload_Audio;