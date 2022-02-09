import './MultipleObjectDataPanel.css'

import { useEffect, useState } from 'react';
import axios from 'axios';

import getCSRF from './getCSRF.js'
axios.defaults.headers.common["X-CSRFTOKEN"] = getCSRF();

function MultipleObjectDataPanel(props) {
    //temporary fix to display animal colors

    const [ field_types, setFieldTypes ] = useState(null)
    const [ list, setList ] = useState(null)

    useEffect(() => {
        //get types of fields
        let form = new FormData
        form.append('model', 'animal')
        axios({
            method: 'post',
            url: 'get-field-types/',
            data: form
        }).then(function(response) {
            setFieldTypes(response.data)
        })

        let form2 = new FormData
        form2.append('return', 'list')
        form2.append('model', 'animal')

        axios({
            method: 'post',
            url: 'get-model/',
            data: form2
        }).then(function(response) {
            setList(response.data)
        })
    }, [props])


    function rgbToHex(color) {

        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length === 1? '0'+hex : hex;
        }

        var split = color.split('(')[1].split(')')[0].split(',')
        var r = parseInt(split[0])
        var g = parseInt(split[1])
        var b = parseInt(split[2])

        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }


    function hexToRgba(h, alpha) {
        let r = 0, g = 0, b = 0;

        // 3 digits
        if (h.length == 4) {
            r = "0x" + h[1] + h[1];
            g = "0x" + h[2] + h[2];
            b = "0x" + h[3] + h[3];

        // 6 digits
        } else if (h.length == 7) {
            r = "0x" + h[1] + h[2];
            g = "0x" + h[3] + h[4];
            b = "0x" + h[5] + h[6];
        }
        
        return "rgba("+ +r + "," + +g + "," + +b + "," + +alpha + ")";
    }

    function onColorChange(e) {
        var hex = e.target.value
        var new_color = hexToRgba(hex, 0.3)
        var animal_id = e.target.parentElement.getAttribute('animal_key')
        
        let form = new FormData
        form.append('model', 'animal')
        form.append('id', animal_id)
        form.append('field_key', 'color')
        form.append('new_value', new_color)

        axios({
            method: 'post',
            url: 'update-object/',
            data: form
        }).then(function(response) {
            console.log(response.data)
        })
    }


    return (
        <div className='temp-object-data-panel'style={props.style_options? {...props.style_options} : null}>

            {list ? list.map(function(list_object) {

                return (
                    <div key={list_object.id} animal_key={list_object.id}>
                        <div className='temp-data-panel-key'>
                            {String(list_object.title) + ': '}
                        </div>
                        {Object.keys(list_object).map(function(key) {
    
                            if (!props.keys || props.keys.includes(key)) {
                                return (
                                    <input 
                                        className='temp-data-panel-value'
                                        key={key}
                                        type='color' 
                                        defaultValue={rgbToHex(list_object.color)}
                                        onInput={(e)=>onColorChange(e)}
                                    />
                                )
                            }
                        })}
                    </div>
                    
                )

            }) : <div/>}

        </div>
    )
}

export default MultipleObjectDataPanel