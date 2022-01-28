import axios from 'axios'
import { useState, useEffect } from 'react'

function SelectionList(props) {
    //general selection list

    //props:
    //list-type: backend-data
        //object - the name of the object in backend to list

    if (props.list_type=='backend-data') {
        
        let form = new FormData
        form.append('object', props.object)
        form.append('return', 'list')

        axios({
            method: 'get',
            url: 'get-model',
            formdata: form
        })
    }
    
    return <div>hello</div>
}

export default SelectionList