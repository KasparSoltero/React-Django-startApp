import axios, { Axios } from "axios";
import { useState } from 'react';


// Required to allow axios to make post requests to django
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"


function Fourth() {

    const [ output, setOutput ] = useState('0000')
    const [ input, setInput  ] = useState(0)

    function UpdateOutput() {

        setInput(input+1);
        
        var temp = document.getElementById('testinput').value
        temp = parseInt(temp)

        console.log(temp)
        console.log(typeof(temp))
        setInput(temp)

        // axios post method, sends some form data to the function specified by the url
        // response is recieved in the .then() function which updates the output accordingly
        axios({
            method: 'post',
            url: '/test/',
            data: {
                value: input,
                testdata2: 'Talofa'
                }
            })
        .then(
            (response)=>setOutput(response.data));
    }

    return (
        <div className='container'>
            Testing sending data to function views!
            <br/>
            Simple area of circle example calculation done in python:
            <br/>
            Input radius :
            <input type='number' id='testinput'/>
            <br/>
            <button className='uploadbutton' onClick={()=>UpdateOutput()}>Submit</button>
            <br/>
            Area of circle is :
            {output}
        </div>
    )
}

export default Fourth