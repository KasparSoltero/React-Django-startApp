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

    const [ count, setCount ] = useState(0)

    return (
        <div className='container'>
            Testing audio / Spectrogram display... doesn't do much right now

            <div className='upload-area'>
                Upload Audio Here

                {/* <form> */}
                    <input type="file" id="inputAudio" name="inputAudio" onChange={()=>(3)} />
                    <button className='uploadbutton' onClick={()=>null}>Send</button>
                {/* </form> */}

            </div>
            <div className='audio-container'>
                Audio display area
            </div>
        </div>
    )
}

export default Audio;