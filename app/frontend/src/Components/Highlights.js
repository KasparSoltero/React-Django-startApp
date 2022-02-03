import { useState, useEffect } from 'react'
import axios from 'axios'

function Highlights(props) {

    const [ audio_clips, setAudioClips ] = useState(null)

    const [ selected_highlight, setSelectedHighlight ] = useState(null);
    const [ is_dragging, setIsDragging] = useState(false);
    const [ xInitial, setXInitial ] = useState(null)
    const [ xPos, setXPos ] = useState(null);
    const [ highlightXInitial, setHighlightXInitial ] = useState(null);
    const [ dragging_left, setDraggingLeft ] = useState(null)
    const [ highlightWidthInitial, setHighlightWidthInitial ] = useState(null)


    useEffect(() => {
        updateAudioClips()
        setSelectedHighlight(null)
    }, [props.audio_file])


    useEffect(()=> {
        //send selected highlight to parent function
        if (props.onSelect) {
            let form = {
                html_selected: selected_highlight,
                object_id: selected_highlight? selected_highlight.getAttribute('highlight_id'): null
            }
            props.onSelect(form)
        }
    }, [selected_highlight])


    function updateAudioClips() {
        //get noiseclips associated with audioFile from database
        const form = (new FormData)
        form.append('object', 'AudioClip')
        form.append('return', 'filtered_list')
        form.append('id', props.audio_file.id)

        axios({
            method: 'post',
            url: 'get-model/',
            data: form
        }).then(function(response) {
            setAudioClips(response.data)
        })
    }


    function updateHighlight() {
        // edit highlight's stored times in the database based on the user's edits
        let hl = selected_highlight

        const duration = parseFloat(props.audio_file.duration)

        let new_start = Math.round(100*duration *  hl.offsetLeft / hl.offsetParent.offsetWidth) / 100
        let new_end = Math.round(100*duration * (hl.offsetWidth + hl.offsetLeft) / hl.offsetParent.offsetWidth) / 100

        let formdata = new FormData
        formdata.append('id', selected_highlight.getAttribute('highlight_id'))
        formdata.append('start', new_start)
        formdata.append('end', new_end)

        axios({
            method: 'post',
            url: 'update-highlight/',
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
                hl.style.backgroundColor = changeAlpha(hl.style.backgroundColor, 0.3)
            }
        }

        //deselect or change selected highlight clip
        let hl = e.target
        if (!(hl == selected_highlight)) {
            hl.style.backgroundColor = changeAlpha(hl.style.backgroundColor, 0.8)
            setSelectedHighlight(hl)
        } else {
            hl.style.backgroundColor = changeAlpha(hl.style.backgroundColor, 0.3)
            setSelectedHighlight(null)
        }
    }


    function handleMouseDown(e) {

        if ((e.target.className == 'highlight') && selected_highlight) {
            //initial x position for dragging
            if (xInitial == null) {
                setXInitial(e.pageX)
                setHighlightXInitial(selected_highlight.offsetLeft)
                setHighlightWidthInitial(selected_highlight.offsetWidth)
            }
            handleHighlightDrag(e)
        }
    }


    function handleHighlightDrag(e) {
        
        setIsDragging(true)

        let mouse = e.pageX - selected_highlight.offsetParent.offsetLeft
        let left = selected_highlight.offsetLeft
        let right = selected_highlight.offsetLeft + selected_highlight.offsetWidth

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

        } else if (is_dragging) { // if mouse was dragging

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
        if (is_dragging && xInitial) {

            setXPos(e.pageX - xInitial)
            if (dragging_left == true) {
                selected_highlight.style.marginLeft = String(highlightXInitial + xPos) + 'px'
                selected_highlight.style.width = String(highlightWidthInitial - xPos) + 'px'
            } else if (dragging_left == false) {
                selected_highlight.style.width = String(highlightWidthInitial + xPos) + 'px'
            }
        }
    }


    return (
        <div>
            {audio_clips ? audio_clips.map(function(clip) {
                const duration = parseFloat(props.audio_file.duration)
                
                // let color = response.data[i]['color']
                let color = 'rgba(255,0,0,0.3)'

                let start = parseFloat(clip.start_time)
                let end = parseFloat(clip.end_time)

                let rel_start = Math.round(100*start/duration)
                let rel_end = Math.round(100*end/duration)

                return (
                    <div 
                        className='highlight' 
                        highlight_id={clip.id}
                        style={{
                            width: String(rel_end-rel_start) + "%",
                            height:'100px',
                            backgroundColor: color,
                            marginLeft: String(rel_start) + "%",
                            top: '0px',
                            position: 'absolute',
                            zIndex: 10,
                        }}
                        onMouseDown={handleMouseDown} 
                        onMouseUp={handleMouseUp} 
                        onPointerMove={handlePointerMove} 
                    />
                )
            }) : null}
        </div>
        )
    }


export default Highlights