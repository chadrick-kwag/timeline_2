import React from 'react'
import Button from 'react-bootstrap/Button'


export class EventSlotContainer extends React.Component {

    draw() {
        this.maindiv.style.position = 'absolute'
        this.maindiv.style.left = this.props.left
        this.maindiv.style.height = this.props.boxheight + "px"

        let currheight = this.maindiv.offsetHeight

        this.maindiv.style.top = this.props.cy - (currheight / 2)

    }

    componentDidMount() {
        this.draw()
    }

    componentDidUpdate() {
        this.draw()
    }

    render() {
        var eventslots = []
        var more_flag = false
        for (var i = 0; i < this.props.data.length; i++) {
            if (i > 2) {
                more_flag = true
                break
            }

            let isSelected = this.props.data[i].event_index == this.props.selected_event_index

            let props = {
                data: this.props.data[i],
                event_click_handler: this.props.event_click_handler,
                selected: isSelected,
                slotwidth: this.props.slotwidth
            }
            eventslots.push(<EventSlot {...props} />)
        }

        if(more_flag){
            eventslots.push(<Button>+</Button>)
        }

        return (
            <div ref={el => this.maindiv = el} style={{
                display: 'flex',
                flexDirection: 'row',
                height: this.props.boxheight + "px",
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: this.props.slotwidth
            }}>
                {eventslots}

            </div>
        )

    }
}


class EventSlot extends React.Component {


    constructor(props) {
        super(props)

        this.clickhandler = this.clickhandler.bind(this)
    }

    clickhandler() {
        this.props.event_click_handler(this.props.data.event_index)
    }

    render() {

        let spanstyle = this.props.selected ? 'bold' : 'normal'

        return (
            <div ref={el => this.maindiv = el} className="card" style={{ maxWidth: this.props.slotwidth + "px", 
            display: 'flex',
            justifyContent: 'center',
            padding: '2px' }} onClick={this.clickhandler}>

                <span style={{
                    fontWeight: spanstyle, 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'                    
                    
                }}>{this.props.data.title}</span>
            </div>
        )

    }
}