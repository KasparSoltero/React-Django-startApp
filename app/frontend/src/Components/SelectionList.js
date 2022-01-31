import axios from 'axios'
import { useState, useEffect } from 'react'
import './SelectionList.css'


axios.defaults.headers.common["X-CSRFTOKEN"] = 'gPvOPnEwl4K7jFnYGucAwkW06M5RrJFRvEtwPMUNbylfnVsG0BOm5niJPd3COr9r';


function SelectionList(props) {
    //general selection list

    //props:
    //list_type: backend-data
        //object - the name of the object in backend to list
        //display_title
        //display_audio
    //selectable - are list items selectable?
    //updateSelected - function to which selected item is passed
    //style_options - passed to css style of the list container
    
    const [ list, setList ] = useState(null)

    useEffect(() => {
        if (props.list_type==='backend-data') {
        
            let form = (new FormData)
            form.append('object', props.object)
            form.append('return', 'list')
    
            axios({
                method: 'post',
                url: 'get-model/',
                data: form
            }).then((response) => {
                setList(response.data)
            }
            )
        }
    }, [props])


    function handleItemClick(e) {

        //send selected item to parent component
        let pk = e.currentTarget.getAttribute('pk')
        let selected_db_object = list.find((obj) => String(obj.id)===pk)

        let form = {
            html_selected: e.currentTarget,
            object: selected_db_object
        }

        props.updateSelected(form)

        //update visuals to show selected component
        for (let el of document.getElementsByClassName('list-element')) {
            el===e.currentTarget? el.className = 'list-element selected' : el.className = 'list-element selectable'
        }
    }


    function displayElement(el) {

        return (
            <div className='selection-list-element-container'>

                {props.display_title? <div class='selection-list-title'>
                    {String(el.title)}
                </div> : <div class='invisible'/>}

                {props.display_audio? <audio 
                    controls
                    src={el.filedata}
                    class='selection-list-audio'>
                </audio> : <div class='invisible'/>}

            </div>
        )
    }
    

    return (
        <div id='list-container' style={props.style_options? {...props.style_options} : null}>
            {list? list.map(function(list_element) {

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
    )
}

export default SelectionList