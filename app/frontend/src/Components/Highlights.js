import { useState, useEffect } from 'react'
import axios from 'axios'

function Highlights(props) {

    const [ noiseclips, setNoiseclips ] = useState(null)


    //things for highlight selection / editing, should move to different script
    const [ selectedHighlight, setSelectedHighlight ] = useState(null);
    const [ isDragging, setIsDragging] = useState(false);
    const [ xInitial, setXInitial ] = useState(null)
    const [ xPos, setXPos ] = useState(null);
    const [ highlightXInitial, setHighlightXInitial ] = useState(null);
    const [ draggingLeft, setDraggingLeft ] = useState(null)
    const [ highlightWidthInitial, setHighlightWidthInitial ] = useState(null)


    useEffect(() => {
        console.log('tolato')
        updateNoiseclips()
        setSelectedHighlight(null)
    }, [props])

    function updateNoiseclips() {
        //get noiseclips associated with audioFile from database
        const form = (new FormData)
        form.append('object', 'Noiseclip')
        form.append('return', 'filtered_list')
        form.append('id', props.audioFile.id)

        axios({
            method: 'post',
            url: 'get-model/',
            data: form
        }).then(function(response) {
            setNoiseclips(response.data)
        })
    }


    function updateHighlight() {
        // edit highlight's stored times in the database based on the user's edits

        let hl = selectedHighlight

        const duration = parseFloat(props.audioFile.duration)

        let newStart = Math.round(100*duration *  hl.offsetLeft / hl.offsetParent.offsetWidth) / 100
        let newEnd = Math.round(100*duration * (hl.offsetWidth + hl.offsetLeft) / hl.offsetParent.offsetWidth) / 100

        let formdata = new FormData
        formdata.append('id', selectedHighlight.getAttribute('highlight_id'))
        formdata.append('start', newStart)
        formdata.append('end', newEnd)

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
        }
    }



    return (
        <div>
            {noiseclips ? noiseclips.map(function(nc) {

                const duration = parseFloat(props.audioFile.duration)
                
                // let color = response.data[i]['color']
                let color = 'rgba(255,0,0,0.3)'

                let start = parseFloat(nc.startTime)
                let end = parseFloat(nc.endTime)

                let relStart = Math.round(100*start/duration)
                let relEnd = Math.round(100*end/duration)

                return (
                    <div 
                        className='highlight' 
                        highlight_id={nc.id}
                        style={{
                            width: String(relEnd-relStart) + "%",
                            height:'100px',
                            backgroundColor: color,
                            marginLeft: String(relStart) + "%",
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