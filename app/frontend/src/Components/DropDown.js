import './DropDown.css'

import { useEffect, useState } from 'react';
import axios from 'axios'

function DropDown(props) {

    const [ objects, setObjects ] = useState(null)
    const [ list, setList ] = useState(null)
    const [ current, setCurrent ] = useState(null)

    useEffect(()=>{ //retrieve list objects on initialize or props change
        let form = new FormData
        form.append('return', 'list')
        form.append('model', props.model)
        axios({
            method: 'post',
            url: 'get-model/',
            data: form,
        }).then((response)=>{

            //current 'default' object for header
            let a = response.data.find((element)=>String(element.id)===String(props.default))
            setCurrent(a)

            //all objects to display
            setObjects(response.data)
        })

    }, [ props ])


    useEffect(()=>{ //updates drop down menu when objects or selected object changes
        if (objects) {
            let container = document.querySelector('.drop-down#'+props.id)
            container.innerHTML = '' //delete container contents

            let temp = []

            objects.map((object)=>{
                var option = document.createElement('div')
                option.innerHTML = object.title
                option.setAttribute('id', props.id)

                if (object===current) {//default object provided by props is set as header
                    option.setAttribute('class', 'drop-down-header')
                    temp.unshift(option)
                } else {
                    option.setAttribute('class', 'drop-down-option')
                    option.setAttribute('object_id', object.id)
                    option.addEventListener('click', handleClick)
                    temp.push(option)
                }
            })

            temp[temp.length-1].style.borderRadius = '0px 0px 5px 5px'

            //this layout ensures that the header is added first, before the other options
            for (let option of temp) {
                container.appendChild(option)
            }
        }
    }, [ objects, current ])


    function handleClick(e) {
        props.onSelect(e.target.getAttribute('object_id'))
        
        //vanish menu
        let container = document.querySelector('.drop-down#'+props.id)

        //change selected object
        let new_current = objects.find((element)=>String(element.id)===String(e.target.getAttribute('object_id')))
        setCurrent(new_current)
    }

    return (
        <div className='drop-down' id={props.id} style={props.style_options? {...props.style_options} : null}>
        </div>
    )
}

export default DropDown