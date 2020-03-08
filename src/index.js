import React from 'react'
import ReactDOM from 'react-dom'
import {Container, Row, Col} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css'


class EventDetailArea extends React.Component{

    render(){

        var title_text_fn = ()=>{
            if(this.props.showindex==null){
                return ""
            }
            else{
                return this.props.data[this.props.showindex].event_title
            }
        }

        return (
        <div className="event-detail-area-container">
            <h1>{title_text_fn()}</h1>
        </div>
        )
    }
}

class TimelineFigureArea extends React.Component{

    

    constructor(props){
        super(props)
        
        this.event_markers = React.createRef()
        this.event_markers.current = []
        
        console.log("event markers in constructor")
        console.log(this.event_markers)


        this.event_marker_rel_pos_array = React.createRef()
        this.event_marker_rel_pos_array.current = []


        this.state={
            
            dot_marker_radius: 10,
            marker_cy_arr: [],
            timeline_cx : null

            
        }

        this.get_event_rel_y_pos_arr = this.get_event_rel_y_pos_arr.bind(this)
        this.marker_click_handler = this.marker_click_handler.bind(this)
    }


    drawTimeline(statecopy){

        this.timeline.style.position = "relative"
        const timelineoffsetwidth = this.timeline.offsetWidth
        const containerWidth = this.container.offsetWidth

        console.log("timelinewidth: " + timelineoffsetwidth)
        console.log("containerwidth: " + containerWidth)

        const timelinewidth = 10 // px

        let rt_timeline_cx = containerWidth/2

        statecopy.timeline_cx = rt_timeline_cx

        const tl_left = (containerWidth - timelinewidth)/2
        const tl_right = (containerWidth + timelinewidth)/2
        
        this.timeline.style.marginTop = "30px"
        this.timeline.style.left = tl_left + 'px'
        this.timeline.style.width = timelinewidth + 'px'
        this.timeline.style.height = "2000px"
        this.timeline.style.backgroundColor = "#000"


        console.log("timeline height: " + this.timeline.offsetHeight)

        // set container height
        this.container.style.height = this.timeline.offsetHeight
    }


    drawEvents(statecopy){

        console.log("inside drawEvents")

        const timeline_height = 2000
        let rt_marker_cy_arr=[]

        this.event_marker_rel_pos_array.current.map(v=>{
            rt_marker_cy_arr.push(v* timeline_height )
        })


        statecopy.marker_cy_arr = rt_marker_cy_arr
    }

    redraw(statecopy){

        
        console.log('redraw triggered')
        this.container.style.position= 'relative'


        this.drawTimeline(statecopy)
        this.drawEvents(statecopy)

        console.log(this.event_markers)
        // update statecopy
        console.log("statecopy after")
        console.log(statecopy)

        console.log("cuerent this.state:")
        console.log(this.state)


        if(JSON.stringify(this.state)==JSON.stringify(statecopy)){
            console.log("compare match")
        }
        else{
            console.log("compare not match")
            this.setState(statecopy)
        }
        
    }


    get_event_rel_y_pos_arr(){

        let date_arr = this.props.data.map(d=> d.date)

        // get min max date
        let mindate =null
        let maxdate = null

        date_arr.map(d=>{
            if(mindate==null || d < mindate){
                mindate = d
            }

            if(maxdate==null || d > maxdate){
                maxdate = d
            }
        })

        console.log("mindate: " + mindate)
        console.log("maxdate: " + maxdate)

        let datespan = maxdate - mindate

        var relpos = []

        date_arr.map(d=>{
            relpos.push((d-mindate)/datespan)
        })

        return relpos
    }


    componentDidMount(){
        let statecopy = JSON.parse(JSON.stringify(this.state))
        console.log("didmount cretaed statecopy: ")
        console.log(statecopy)
        this.redraw(statecopy)
    }

    componentDidUpdate(){
        let statecopy = JSON.parse(JSON.stringify(this.state))
        this.redraw(statecopy)
    }

    marker_click_handler(selected_index){
        this.props.updateSelectedEventIndex(selected_index)
    }

    render(){

        console.log("render triggered")

        // get rel y pos
        let date_rel_pos = this.get_event_rel_y_pos_arr()
        this.event_marker_rel_pos_array.current = date_rel_pos
        console.log(this.event_marker_rel_pos_array)

        this.event_markers.current = []

        

        var create_children = this.props.data.map((d,i)=>{

            let selected_bool = i==this.props.selected_event_index
            return <EventMarker key={"unique"+i} radius={this.state.dot_marker_radius} cx={this.state.timeline_cx} cy = {this.state.marker_cy_arr[i]} selected={selected_bool} onclickhandler={this.marker_click_handler} event_index={i}/>
        })

        var date_textboxes = this.props.data.map((d,i)=>{
            return <DateMarker key={"datemk"+i} cy = {this.state.marker_cy_arr[i]} date={this.props.data[i].date}/>
        })


        return(

            
            <div ref={el => this.container = el} >
                <div ref={el => this.timeline = el}></div>
                {create_children}
                {date_textboxes}
            </div>
        )
    }
}

class DateMarker extends React.Component{

    constructor(props){
        super(props)

        this.format_date_to_str = this.format_date_to_str.bind(this)

    }


    draw(){
        this.maindiv.style.position = 'absolute'
        let textwidth = this.textspan.offsetWidth
        let textheight = this.textspan.offsetHeight

        let top = this.props.cy - (textheight/2)

        this.maindiv.style.top = top

        this.textspan.style.color = "#000"
        
        
    }

    componentDidMount(){
        this.draw()
    }

    componentDidUpdate(){
        this.draw()
    }

    format_date_to_str(){
        console.log(this.props.date)
        let year = this.props.date.getFullYear()
        let month = this.props.date.getMonth() +1
        let day = this.props.date.getDate()

        return year + "/" + month + "/" + day
    }

    render(){
        return (
            <div ref={el=>this.maindiv = el}>
                <span ref={el => this.textspan = el}>{this.format_date_to_str(this.props.date)}</span>
            </div>
        )
    }
}


class EventMarker extends React.Component{

    constructor(props){
        super(props)

        this.handleclick = this.handleclick.bind(this)

    }

    redraw(){

        var real_draw_radius
        if(this.props.selected){
            real_draw_radius = this.props.radius * 1.5
        }
        else{
            real_draw_radius = this.props.radius
        }

        this.maindiv.style.position = "absolute"
        this.maindiv.style.width = real_draw_radius *2 + "px"
        this.maindiv.style.height = real_draw_radius *2 + "px"
        this.maindiv.style.borderRadius = real_draw_radius + "px"
        this.maindiv.style.backgroundColor = "#f00"

        this.maindiv.style.left = (this.props.cx - real_draw_radius) + "px"
        this.maindiv.style.top = (this.props.cy - real_draw_radius) + "px"
    }

    componentDidMount(){
        this.redraw()
    }

    componentDidUpdate(){
        this.redraw()
    }

    handleclick(){
        console.log("clicked" )
        this.props.onclickhandler(this.props.event_index)
    }

    render(){
        return (
            <div ref={el=> this.maindiv = el} onClick={this.handleclick}></div>
        )
    }
}


class TimeLineWorkSpace extends React.Component{

    constructor(props){
        super(props)
        this.state={
            data: [
                {
                    "date": new Date(2020,0,1),
                    "event_title": "first event"
                },
                {
                    "date": new Date(2020,0,2),
                    "event_title": "second event"
                },
                {
                    "date": new Date(2020,0,15),
                    "event_title": "last event"
                }
            ],
            selected_event_index : null
        }

        this.updateSelectedEventIndex = this.updateSelectedEventIndex.bind(this)
    }


    updateSelectedEventIndex(newindex){
        console.log("update new index: ", newindex)
        this.setState({selected_event_index: newindex})
    }

    createEventMarkers(){
        return this.state.data.map((d,i)=>{
            return <EventMarker/>
        })
    }

    render(){
        return (
            
            <Container>
                <Row>
                    <Col>
                    <TimelineFigureArea data = {this.state.data} updateSelectedEventIndex = {this.updateSelectedEventIndex} eventMarkers={this.createEventMarkers()} selected_event_index={this.state.selected_event_index}/>
                    </Col>
                    <Col>
                    <EventDetailArea showindex={this.state.selected_event_index} data={this.state.data} />
                    </Col>
                </Row>
            </Container>
            
        )
    }
}


class App extends React.Component{


    render(){
        return (<div>
            
            <TimeLineWorkSpace/>
        </div>)
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
)