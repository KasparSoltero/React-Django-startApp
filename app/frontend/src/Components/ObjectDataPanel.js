import './ObjectDataPanel.css'

function ObjectDataPanel(props) {
    //display mutable and/or immutable data about an object

    //object - object to display data for
    //mutable: true/false - should object values be alterable?
    //keys - which keys of object to display, if left blank all keys are displayed
    //style_options - custom css styles passed to data panel

    return (
        <div className='object-data-panel'style={props.style_options? {...props.style_options} : null}>
            
            {Object.keys(props.object).map(function(key) {

                return (
                    <div className='data-panel-property'>

                        <div className='data-panel-key'>
                            {key + ': '}
                        </div>

                        <div className='data-panel-value'>
                            {String(props.object[key])}
                        </div>

                    </div>
                )
            })}
        </div>
    )
}

export default ObjectDataPanel