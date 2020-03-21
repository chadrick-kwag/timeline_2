import React from 'react'



class EventCard extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            text: this.props.text
        }

        this.redraw = this.redraw.bind(this)
    }

    redraw() {
        let newtext = this.state.text

        let textspanheight = this.textspan.offsetHeight
        let maindivheight = this.maindiv.offsetHeight

        if (textspanheight > maindivheight) {
            newtext = newtext.slice(0, newtext.length - 1)
            this.setState({ text: newtext })
        }
    }

    componentDidMount() {
        this.redraw()
    }

    componentDidUpdate() {
        this.redraw()
    }

    render() {
        return (
            <div ref={e => this.maindiv = e} className="card eventcard" style={this.props.cardstyle} onClick={e => this.props.cardClickHandler()} key={this.props.key}>
                <span ref={el => this.textspan = el}>
                    {this.state.text}
                </span>
            </div>
        )
    }
}

class EventCardDisplay extends React.Component {


    render() {
        return (
            <div ref={el => this.maindiv = el} style={{ display: 'flex', overflowX: 'auto' }} onWheel={e => {
                this.maindiv.scrollLeft += e.deltaY
            }} className="scrollbar">
                {this.props.group_index_arr.map(i => {
                    let cardstyle = {
                        backgroundColor: i == this.props.selectedIndex ? '#0275d8' : '#fff',
                        color: i== this.props.selectedIndex ? '#fff' : '#000',
                        flex: "0 0 30%",
                        height: "4em",
                        margin: '0.5em',
                        display: 'flex',
                        justifyContent: 'center'
                    }
                    return <EventCard cardstyle={cardstyle} cardClickHandler={() => { this.props.cardClickHandler(i) }} text={this.props.data[i].title} key={'eventcard'+i} />
                })}

            </div>
        )
    }
}


export class EventDetailArea extends React.Component {

    render() {

        var title_text_fn = () => {
            if (this.props.showindex == null) {
                return ""
            }
            else {
                return this.props.data[this.props.showindex].event_title
            }
        }

        var body_text_fn = () => {
            if (this.props.showindex == null) {
                return ""
            }
            else {
                return this.props.data[this.props.showindex].body
            }
        }

        var ref_content = () => {
            if (this.props.showindex == null) {
                return
            }
            else {
                let ref_arr = this.props.data[this.props.showindex].ref

                let ret_arr = []
                ref_arr.forEach(r => {
                    ret_arr.push(<a className="event-ref" href={r} target="_blank">{r}</a>)
                })

                return ret_arr
            }
        }

        var eventCardDisplay = null
        let selected_event_index_group = null

        if (this.props.event_index_group_arr != null) {

            for (var i = 0; i < this.props.event_index_group_arr.length; i++) {
                if (this.props.event_index_group_arr[i].includes(this.props.showindex)) {
                    selected_event_index_group = this.props.event_index_group_arr[i]
                    break
                }
            }


            if (selected_event_index_group != null && selected_event_index_group.length > 1) {
                eventCardDisplay = <EventCardDisplay cardClickHandler={this.props.cardClickHandler}
                    data={this.props.data} group_index_arr={selected_event_index_group} selectedIndex={this.props.showindex} />
            }
        }



        return (
            <div className="event-detail-area-container" style={{height: this.props.height+'px'}}>
                {eventCardDisplay}
                <div className="event-detail-title"><h1>{title_text_fn()}</h1></div>
                <div >
                    <div style={{ padding: "1em" }} className="event-detail-body">
                        <p>{body_text_fn()}</p>
                    </div>
                    <div style={{ padding: "1em" }}>
                        {ref_content()}
                    </div>
                </div>

            </div>
        )
    }
}
