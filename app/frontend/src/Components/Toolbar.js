import './Toolbar.css'
import { useState, useEffect } from 'react'

function Toolbar(props) {

    const [ playing, setPlaying ] = useState(false)

    function playPause() {
        return (
            <button className={'playpause-button '+(playing? 'playing':'paused')} onClick={function() {
                if (props.wavesurfer != null) {
                    props.wavesurfer.playPause()
                    setPlaying(()=>props.wavesurfer.isPlaying())
                }
            }}>{playing? 'Pause':'Play'}</button>
        )
    }   

    function highlights() {

        let highlight_tool = props.highlight_tool
        let setHighlightTool = props.setHighlightTool

        return (
            <button className={'highlight-tool '+String(props.highlight_tool)}
                onClick={()=>setHighlightTool((highlight_tool)=>!highlight_tool)}
            >
                Add Highlight
            </button>
        )
    }

    return (
        <div className='toolbar'>
            {props.playpause ? playPause() : null}
            {props.highlights ? highlights() : null}
        </div>
    )
}

export default Toolbar