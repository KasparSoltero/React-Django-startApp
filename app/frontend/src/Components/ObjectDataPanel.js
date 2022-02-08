import './ObjectDataPanel.css'
import { useEffect } from 'react'
import axios from 'axios'

import getCSRF from './getCSRF.js'
axios.defaults.headers.common["X-CSRFTOKEN"] = getCSRF();

function ObjectDataPanel(props) {
    //display mutable and/or immutable data about an object

    //object - object to display data for
    //mutable: true/false - should object values be alterable?
    //keys - which keys of object to display, if left blank all keys are displayed
    //style_options - custom css styles passed to data panel

    function onValueChange(e) {
        // console.log(document.getElementById('title').value)
        // console.log(e)
        // console.log(e.target)
        // console.log(e.target.id)
        // console.log(props.object)
        // console.log(props.object.id)
    }

    function onButtonPress(e) {
        let field_key = e.target.id.split('-')[0]
        let new_value = document.getElementById(field_key).value

        let form = new FormData
        form.append('model', 'audioclip')
        form.append('id', props.object.id)
        form.append('field_key', field_key)
        form.append('new_value', new_value)

        axios({
            method: 'post',
            url: 'update-object/',
            data: form
        }).then(function(response) {
            console.log(response)
        })
    }

    return (
        <div className='object-data-panel'style={props.style_options? {...props.style_options} : null}>

            {Object.keys(props.object).map(function(key) {

                if (!props.keys || props.keys.includes(key)) {
                    return (
                        <div className='data-panel-property' key={key}>
    
                            <div className='data-panel-key'>
                                {key + ': '}
                            </div>
                            <input id={key} className='data-panel-value'
                                type='text'
                                defaultValue={String(props.object[key])}
                                onInput={onValueChange}
                            />
                            <button id={key+'-button'} className='data-panel-update-button' type='button' onClick={onButtonPress}/>
    
                        </div>
                    )
                }
            })}
        </div>
    )
}

export default ObjectDataPanel