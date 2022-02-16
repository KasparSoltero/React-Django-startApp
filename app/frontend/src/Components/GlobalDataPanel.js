import axios from 'axios'
import { useEffect, useState } from 'react'
import './GlobalDataPanel.css'

function GlobalDataPanel(props) {

    const [ list, setList ] = useState(null)

    useEffect(()=>{
        let form = new FormData
        form.append('none', 'none')

        axios({
            method: 'post',
            url: 'get-metrics/',
            data: form,
        }).then((response)=>{
            setList(response.data)
        })
    }, [props])

    return (
        <div className='global-data-panel'>
            {list? Object.entries(list).map((x)=>{
                return (
                    <div key={x}>
                        <div className='global-data-key'>
                            {x[0]}
                        </div>
                        <div className='global-data-value'>
                            {x[1]}
                        </div>
                    </div>
                )
            })
            : null}
        </div>
    )
}

export default GlobalDataPanel