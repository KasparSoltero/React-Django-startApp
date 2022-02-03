import axios from 'axios'
import { useState, useEffect } from 'react'
import './SelectionList.css'

import getCSRF from './getCSRF.js'
axios.defaults.headers.common["X-CSRFTOKEN"] = getCSRF();

function SelectionList(props) {
    //general selection list

    //props:
    //list_type: backend-data
        //object - single object or list of object to retrieve from backend
                    //should be in array form: ['audiofile']
        //display_title - display title of object?
        //display_audio - display audio controls for file?
    //selectable - are list items selectable?
    //onSelect - function to which selected item is passed upwards
    //style_options - passed to css style of the list container
    
    const [ list, setList ] = useState(null)
    const [ is_table, setIsTable ] = useState(null)
    const [ selected_header, setSelectedHeader ] = useState(null)

    useEffect(() => {

        if (props.list_type==='backend-data') {
        
            if (!selected_header) {
                if (props.object.length > 1) {
                    //if multiple objects are provided, list will provide a table
                    setIsTable(true)
                    setSelectedHeader(props.object[0])
                } else {
                    setIsTable(false)
                    setSelectedHeader(props.object[0])
                }
            }

            let temp = {}

            for (let object of props.object) {

                let form = (new FormData)
                form.append('object', object)
                form.append('return', 'list')

                axios({
                    method: 'post',
                    url: 'get-model/',
                    data: form
                }).then((response) => {
                    temp[object]=response.data
                    
                    if (Object.keys(temp).length == props.object.length) {
                        setList(temp)
                    }
                })
            }
        }
    }, [props])


    function handleHeaderClick(e) {
        setSelectedHeader(e.target.getAttribute('object'))

        //add property for sending selected header to parent component
        for (let header of document.getElementsByClassName('list-header')) {
            header===e.currentTarget? header.className='list-header selected' : header.className='list-header selectable'
        }
    }


    function handleItemClick(e) {

        //send selected item to parent component
        let pk = e.currentTarget.getAttribute('pk')
        let selected_db_object = list[selected_header].find((obj) => String(obj.id)===pk)

        let form = {
            html_selected: e.currentTarget,
            object: selected_db_object
        }

        if (props.onSelect) props.onSelect(form)

        //update visuals to show selected component
        for (let el of document.getElementsByClassName('list-element')) {
            el===e.currentTarget? el.className = 'list-element selected' : el.className = 'list-element selectable'
        }
    }


    function displayElement(el) {

        function displayData() {

            return (
                <div className='list-data-container'>
                    {props.display_data.bool.map(function(booldata) {

                        if (!typeof(booldata)==='object') {booldata = {data: booldata}}

                        return(
                            <div style={{display:'inline'}}>
                                {booldata.title? booldata.title : booldata.data}
                                <div className='list-data-bool-indicator' style={{
                                    backgroundColor: el[booldata.data] ? (booldata.colors? booldata.colors[0]:'rgb(0,255,0)'):(booldata.colors? booldata.colors[1]:'rgb(255,0,0)')
                                }}/>
                            </div>
                        )

                    })}
                </div>
            )
        }

        return (
            <div className='selection-list-element-container'>

                {props.display_title? <div class='selection-list-title'>
                    {String(el.title)}
                </div> : <div class='invisible'/>}

                {(props.display_audio && el.filedata) ? <audio 
                    controls
                    src={el.filedata}
                    class='selection-list-audio'>
                </audio> : <div/>}

                {props.display_data? displayData() : <div/>}

            </div>
        )
    }
    

    return (
        <div id='list-container' style={props.style_options? {...props.style_options} : null}>
            
            <div className='list-headers-container'>
                {is_table ? props.object.map(function(object) {

                    const header_props = {
                        object: object,
                        onClick: (e) => handleHeaderClick(e),
                    }

                    return (
                        <div className={object===selected_header? 'list-header selected':'list-header selectable'} {...header_props}>
                            {object}
                        </div>
                    )
                }) : <div/>}
            </div>
            
            <div className='list-elements-container' style={
                {height: //calculations for height based on other element heights...
                    document.getElementById('list-container') ?
                    (document.getElementsByClassName('list-header')[0] ?
                    String(document.getElementById('list-container').offsetHeight - document.getElementsByClassName('list-header')[0].offsetHeight - 20) + 'px' 
                    : String(document.getElementById('list-container').offsetHeight - 10) + 'px')
                    : 'auto'}}>
                
                {(list && selected_header) ? list[selected_header].map(function(list_element) {//display list elements

                    const element_props = {
                        className: 'list-element',
                        pk: list_element.id
                    }

                    if (props.selectable) {
                        element_props['onClick'] = (e)=>handleItemClick(e)
                        element_props['className'] = 'list-element selectable'
                    }

                    return (
                        <div {...element_props}>
                            {displayElement(list_element)}
                        </div>
                    )
                }) : 'retrieving list...'}

            </div>
        </div>
    )
}

export default SelectionList