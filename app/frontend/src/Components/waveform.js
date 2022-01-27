import './waveform.css'

function waveform(inputs) {
    //data: integer

    if (!inputs) return <div>no inputs</div>

    function bars() {
        if (document.getElementById('waveform-container')) {

            // if (document.getElementById('bars-container')) {
            //     let bars_container = document.getElementById('bars-container')
            //     bars_container.remove()
            // }

            let container = document.getElementById('waveform-container')

            if (container.children[0]) { //delete waveform
                let children = container.children
                console.log(children)
                console.log(container.children)
                for (let child of children) {
                    console.log('removing:')
                    console.log(child.style.cssText)
                    child.remove()
                }
            }

            let data = inputs.data

            for (let int of data) {
                let bar = document.createElement('div')
                bar.className = 'bar'

                bar.style.height = String(int) + 'px'

                //center bars in container, should be driven by container height
                bar.style.marginTop = String((100-int)/2) + 'px'
                bar.style.marginBottom = String((100-int)/2) + 'px'

                container.appendChild(bar)
            }
        }
    }

    return (
        <div id='waveform-container'>
            {bars()}
        </div>
    )
}

export default waveform