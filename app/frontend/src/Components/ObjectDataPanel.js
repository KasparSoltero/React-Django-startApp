import './ObjectDataPanel.css'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

import SelectionList from './SelectionList';
import DropDown from './DropDown';

import getCSRF from './getCSRF.js'
axios.defaults.headers.common["X-CSRFTOKEN"] = getCSRF();


function ObjectDataPanel(props) {
    //display mutable and/or immutable data about an object

    //object - object to display data for
    //mutable: true/false - should object values be alterable?
    //keys - which keys of object to display, if left blank all keys are displayed
    //style_options - custom css styles passed to data panel

    const [ field_types, setFieldTypes ] = useState(null)

    const isMounted = useRef(false)
    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false }
      }, []);
    

    useEffect(() => {
        //get types of *mutable* fields
        let form = new FormData
        form.append('model', 'audioclip')
        form.append('fields', props.keys)
        axios({
            method: 'post',
            url: 'get-field-types/',
            data: form
        }).then(function(response) {
            if (isMounted.current) setFieldTypes(()=>response.data)
        })

    }, [props.object])


    function onButtonPress(e) {
        let field_key = e.target.id.split('-')[0]
        let input_element = document.getElementById(field_key)

        let new_value = input_element.value

        updateDB(field_key, new_value)
    }

    function onCheckedBox(e) {
        let new_value = String(e.target.checked)
        let field_key = e.target.id

        updateDB(field_key, new_value)
    }

    function onForeignKeyChange(object_id) {
        let field_key = 'animal'
        let new_value = object_id

        updateDB(field_key, new_value)
    }

    function updateDB(field_key, new_value) {
        console.log('update DB called')
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
            console.log(response.data)
        })

        if (props.onDataUpdate) {props.onDataUpdate()}
    }


    function displayParameter(key) {
        if (field_types) {

            let field_type = field_types[props.keys.indexOf(key)]
            if (field_type==='CharField') {
                return (
                    <div className='data-panel-value'>
                        <input 
                            className='data-panel-input'
                            id={key}
                            type='text'
                            defaultValue={String(props.object[key])}
                        />
                        <button id={key+'-button'} className='data-panel-update-button' type='button' onClick={onButtonPress}>update</button>
                    </div>
                )
            } else if (field_type==='DecimalField') {
                return (
                    <div className='data-panel-value'>
                        <input
                            className='data-panel-input'
                            id={key}
                            type='number'
                            step={0.01}
                            defaultValue={parseFloat(props.object[key])}
                            autoComplete='off'
                        />
                     <button id={key+'-button'} className='data-panel-update-button' type='button' onClick={onButtonPress}>update</button>
                    </div>
                )
            } else if (field_type==='BooleanField') {
                return (
                    <div className='data-panel-value'>
                        <input
                            className='data-panel-checkbox'
                            id={key}
                            type='checkbox'
                            defaultChecked={props.object[key]}
                            onClick={onCheckedBox}
                        />
                    </div>
                )
            } else if (field_type==='ForeignKey') {
                return (
                    <DropDown
                        id={'test'}
                        model='animal'
                        default={props.object.animal}
                        onSelect={onForeignKeyChange}
                        style_options={{
                            width: 'calc(70% + 20px)',
                            margin: '-10px -10px 0 -10px',
                            backgroundColor: 'var(--pastel-magenta)',
                            padding: '9px',
                            borderRadius: '5px',
                        }}
                    />
                )
            } else return <div>unknown field type</div>

        } else {

            return (
                <div className='data-panel-value'>
                    <input 
                        id={key}
                        type='text'
                        defaultValue={String(props.object[key])}
                    />
                    <button id={key+'-button'} className='data-panel-update-button' type='button' onClick={onButtonPress}/>
                </div>
            )
        }
    }
    

    return (
        <div key={String(props.update_prop)+String(props.object.id)} className='object-data-panel'style={props.style_options? {...props.style_options} : null}>

            {/* {Object.keys(props.object).map(function(key) {

                if (!props.keys || props.keys.includes(key)) {
                    return (
                        <div className='data-panel-property' key={key} ref_key={key}>

                            <div className='data-panel-key'>
                                {key + ': '}
                            </div>
                            {displayParameter(key)}
    
                        </div>
                    )
                }
            })} */}

            {props.keys.map(function(key) {

                // Object.keys(props.object)
                    return (
                        <div className='data-panel-property' key={key} ref_key={key}>

                            <div className='data-panel-key'>
                                {key + ': '}
                            </div>
                            {displayParameter(key)}
    
                        </div>
                    )
            })}
        </div>
    )
}

export default ObjectDataPanel