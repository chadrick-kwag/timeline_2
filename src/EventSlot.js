import React from 'react'


export class EventSlotContainer extends React.Component {

    draw() {
        this.maindiv.style.position = 'absolute'
        this.maindiv.style.left = this.props.left

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
        console.log("inside esc render")
        var eventslots = []
        var more_flag = false
        for (var i = 0; i < this.props.data.length; i++) {
            if (i > 2) {
                more_flag = true
                break
            }

            eventslots.push(<EventSlot data={this.props.data[i]} event_click_handler={this.props.event_click_handler} />)
        }
        console.log("event slots")
        console.log(eventslots)

        return (
            <div ref={el => this.maindiv = el} style={{
                display: 'flex',
                flexDirection: 'row',
                height: this.props.boxheight + "px",
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                {eventslots}

            </div>
        )

    }
}


class EventSlot extends React.Component {


    constructor(props){
        super(props)

        this.clickhandler = this.clickhandler.bind(this)
    }

    clickhandler(){
        console.log("eventslot clicked. event index: " + this.props.data.event_index)
        this.props.event_click_handler(this.props.data.event_index)
    }

    render() {


        return (<div ref={el => this.maindiv = el} className="card" style={{ width: "100px" }} onClick={this.clickhandler}>
            <span>{this.props.data.title}</span>
        </div>)

    }
}