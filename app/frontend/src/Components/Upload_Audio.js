import { React, useState } from 'react';
import axios from "axios";
import './Upload_Audio.css'

function Upload_Audio() {

    const [audioFile, setAudioFile] = useState(0);
    const [audioList, setAudioList] = useState(0);
    const [ output, setOutput ] = useState(0);

    axios
        .get("/api/unprocessedaudios/")
        .then((res) => setAudioList(res))
        .catch((err) => console.log(err));

    function addFileToObjects() {

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
        <div className='container'>
            Second Page... testing file upload! <br/>
            
            <div className='AudioList'>
                List of 'file' objects in database: <br/>
                {JSON.stringify(audioList.data)}
            </div>

            <input name='uploadFile' type='file' id='uploadFile' />
            <button className='uploadbutton' onClick={() => addFileToObjects()}>
                Upload file to database
            </button>

        </div>
    )
}

export default Upload_Audio;