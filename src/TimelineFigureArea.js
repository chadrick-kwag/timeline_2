import React from 'react'
import {EventMarker} from './EventMarker.js'
import {DateMarker} from './DateMarker.js'
import {EventBox} from './EventBox.js'
import {EventSlotContainer} from './EventSlot.js'


export class TimelineFigureArea extends React.Component{

    

    constructor(props){
        super(props)
        
        this.event_markers = React.createRef()
        this.event_markers.current = []
        
        console.log("event markers in constructor")
        console.log(this.event_markers)


        this.event_marker_rel_pos_array = React.createRef()
        this.event_marker_rel_pos_array.current = []

        this.date_to_event_index_list_map = React.createRef()
        this.date_to_event_index_list_map.current = null

        this.unique_date_arr = React.createRef()
        this.unique_date_arr.current = []

        this.event_index_arr_arr = React.createRef()
        this.event_index_arr_arr.current = []


        this.state={
            
            dot_marker_radius: 10,
            marker_cy_arr: [],
            timeline_cx : null

            
        }

        this.get_event_rel_y_pos_arr = this.get_event_rel_y_pos_arr.bind(this)
        this.marker_click_handler = this.marker_click_handler.bind(this)
        this.event_click_handler = this.event_click_handler.bind(this)
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

        
        let date_arr = this.unique_date_arr.current

        if(date_arr.length ==0){
            return []
        }
        
        console.log("date_arr")
        console.log(date_arr)

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

    marker_click_handler(marker_index){
        console.log('marker clicked. marker_index: ' + marker_index)
        // this.props.updateSelectedEventIndex(selected_index)
        
        // find first event index from event index arr of marker index
        // console.log(this.event_index_arr_arr.current[marker_])
        let event_index = this.event_index_arr_arr.current[marker_index][0]
        this.props.updateSelectedEventIndex(event_index)
    }

    event_click_handler(selected_index){
        this.props.updateSelectedEventIndex(selected_index)
    }


    render(){

        // assign event id to all data
        

        let [unique_date_arr, event_index_arr_arr] = get_date_to_event_index_list_map(this.props.data)
        this.unique_date_arr.current = unique_date_arr
        this.event_index_arr_arr.current = event_index_arr_arr
        // this.date_to_event_index_list_map.current = date_to_event_index_list_map

        // if there is selected event index, find unique date index that has that event index. 
        // this will be used for dot marker select bool flag

        let dot_selected_index = null
        if(this.props.selected_event_index!=null){
            for(var i=0;i<event_index_arr_arr.length;i++){
                let include_flag = event_index_arr_arr[i].includes(this.props.selected_event_index)
                if(include_flag){
                    dot_selected_index = i
                    break
                }
            }
        }
        // console.log("dot_selected_index: ", dot_selected_index)
        // console.log("selected event index: ", this.props.selected_event_index)

        console.log("render triggered")

        // get rel y pos
        let date_rel_pos = this.get_event_rel_y_pos_arr()
        this.event_marker_rel_pos_array.current = date_rel_pos
        console.log("event_marker_rel_pos_array")
        console.log(this.event_marker_rel_pos_array)

        this.event_markers.current = []

        

        var dot_markers = this.unique_date_arr.current.map((d,i)=>{

            // let selected_bool = i==this.props.selected_event_index

            let selected_bool = i == dot_selected_index
            return <EventMarker key={"unique"+i} radius={this.state.dot_marker_radius} cx={this.state.timeline_cx} cy = {this.state.marker_cy_arr[i]} selected={selected_bool} onclickhandler={this.marker_click_handler} event_index={i}/>
        })                                                                                                                                                                                              

        var date_textboxes = this.unique_date_arr.current.map((d,i)=>{
            return <DateMarker key={"datemk"+i} cy = {this.state.marker_cy_arr[i]} date={d}/>
        })

        var box_width
        if(!this.timeline){
            box_width = 100
        }
        else{
            console.log("timeline offsetwidth: " + this.timeline.offsetWidth)
            console.log("timeline_cx: " + this.state.timeline_cx)
            box_width = this.container.offsetWidth - this.state.timeline_cx
        }

        console.log("box_width: " + box_width)
        var event_boxes = this.props.data.map((d,i)=>{
            return <EventBox key={"eventbox"+i} cy = {this.state.marker_cy_arr[i]} boxHeight="20" boxMaxWidth={box_width} summaryText={d.event_title} leftLimit={this.state.timeline_cx + 50} selected={i==this.props.selected_event_index} onclickhandler={this.marker_click_handler} event_index={i}/>
        })


        var event_slot_containers = event_index_arr_arr.map((d,i)=>{
            let data_arr = []
            d.forEach(v=>data_arr.push(this.props.data[v]))
            console.log("data_arr")
            console.log(data_arr)
            return <EventSlotContainer data={data_arr} key={"esc_"+i} cy={this.state.marker_cy_arr[i]} height="20" left = {this.state.timeline_cx + 50} event_click_handler = {this.event_click_handler} boxheight="20"/>
        })

        console.log("event_slot_containers")
        console.log(event_slot_containers)


        return(

            
            <div ref={el => this.container = el} >
                <div ref={el => this.timeline = el}></div>
                {dot_markers}
                {date_textboxes}
                {event_slot_containers}
            </div>
        )
    }
}

function get_date_to_event_index_list_map(data){
    let visited_date_fp_arr=[]
    let unique_date_arr = []
    let event_index_arr_arr = []
    // let outmap = new Map()
    // console.log('inside get_date_to_event_index_list')
    // console.log(data)
    if(data==null){
        return {}
    }

    data.map((d,i)=>{
        // let date_fp = d.date.toString()
        let date = d.date
        let date_fp = date.toString()

        let match_exist = false
        for(var k=0;k<visited_date_fp_arr.length;k++){
            if(visited_date_fp_arr[k]==date_fp){
                match_exist = true
                break
            }
        }

        

        if(match_exist){

            let j = visited_date_fp_arr.indexOf(date_fp)
            event_index_arr_arr[j].push(i)
        }
        else{
            visited_date_fp_arr.push(date_fp)
            unique_date_arr.push(date)
            event_index_arr_arr.push([i])
        }
    })

    // console.log("outmap")
    // console.log(outmap)

    console.log("visited_date_fp_arr")
    console.log(visited_date_fp_arr)

    console.log("unique_date_arr")
    console.log(unique_date_arr)

    console.log("event_index_arr_arr")
    console.log(event_index_arr_arr)

    return [unique_date_arr, event_index_arr_arr]
}