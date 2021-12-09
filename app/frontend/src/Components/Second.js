import { React, useState } from 'react';
import axios from "axios";

function Second() {

    const [audioFile, setAudioFile] = useState(0);
    const [audioList, setAudioList] = useState(0);

    axios
        .get("/api/unprocessedaudios/")
        .then((res) => setAudioList(res))
        .catch((err) => console.log(err));

    function addFileToObjects() {

        var audioFile = document.getElementById('uploadFile').files[0];
        var filename = document.getElementById('uploadFile').files[0].name;
        const formdata = new FormData();
        formdata.append("filedata", audioFile)
        
        console.log(typeof(audioFile))
        console.log(audioFile)
        
        axios
            .post("/api/unprocessedaudios/",{
                title: 'alphatest',
                filename: filename, 
                filedata: audioFile["item"]})
            .then((res) => null)
            .catch((err) => console.log(err))
        }


    return (
        <div className='container'>
            Second Page... testing file upload! <br/>
            List of 'file' objects in database: <br/>
            {JSON.stringify(audioList.data)}
                
            <button className='uploadbutton' onClick={()=>
            axios
                .post("/api/unprocessedaudios/",{
                    title: 'betaTest',
                    filename: 'betaTest' })
                .then((res) => null)
                .catch((err) => console.log(err))}>
                    Click to add test file to database
            </button>

            <br/>

            <input name='uploadFile' type='file' id='uploadFile' />
            <button className='uploadbutton' onClick={() => addFileToObjects()}>
                Click to upload file to database
            </button>

        </div>
    )
}

export default Second;