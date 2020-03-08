import React from 'react'
import {EventMarker} from './EventMarker.js'
import {DateMarker} from './DateMarker.js'
import {EventBox} from './EventBox.js'


export class TimelineFigureArea extends React.Component{

    

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


        var event_boxes = this.props.data.map((d,i)=>{
            return <EventBox key={"eventbox"+i} cy = {this.state.marker_cy_arr[i]} boxHeight="20" boxMaxWidth="70" summaryText={d.event_title} leftLimit="200" selected={i==this.props.selected_event_index}/>
        })


        return(

            
            <div ref={el => this.container = el} >
                <div ref={el => this.timeline = el}></div>
                {create_children}
                {date_textboxes}
                {event_boxes}
            </div>
        )
    }
}

