import { React, useState } from 'react';
import './Audio.css';
import Sound from 'react-sound';
import { Spectrogram } from 'react-spectrogram';
import axios from 'axios';

// Required to allow axios to make post requests to django
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

function Audio() {

    const [ audioFile, setAudioFile ] = useState(null);
    const [audioList, setAudioList] = useState(0);

    axios
        .get("/api/unprocessedaudios/")
        .then((res) => setAudioList(res))
        .catch((err) => console.log(err));

    return (
        <div className='container'>
            Testing audio / Spectrogram display...
            
            <div className='AudioList'>
                List of 'file' objects in database: <br/>
                {JSON.stringify(audioList.data)}
            </div>

            <div className='audio-container'>
                Audio display area
            </div>
        </div>
    )
}

export default Audio;