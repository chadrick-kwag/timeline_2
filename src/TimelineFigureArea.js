import React from 'react'
import { EventMarker } from './EventMarker.js'
import { DateMarker } from './DateMarker.js'
import { EventBox } from './EventBox.js'
import { EventSlotContainer } from './EventSlot.js'


export class TimelineFigureArea extends React.Component {



    constructor(props) {
        super(props)

        this.event_markers = React.createRef()
        this.event_markers.current = []

        this.event_marker_rel_pos_array = React.createRef()
        this.event_marker_rel_pos_array.current = []


        this.state = {

            dot_marker_radius: 10,
            marker_cy_arr: [],
            timeline_cx: null,
            timeline_length: this.props.timeline_length


        }

        this.get_event_rel_y_pos_arr = this.get_event_rel_y_pos_arr.bind(this)
        this.marker_click_handler = this.marker_click_handler.bind(this)
        this.event_click_handler = this.event_click_handler.bind(this)
    }


    drawTimeline(statecopy) {

        this.timeline.style.position = "relative"
        const timelineoffsetwidth = this.timeline.offsetWidth
        const containerWidth = this.container.offsetWidth

        


        // find timeline width that will ensure min space between the most close markers
        // first, find closes marker
        let rel_pos_arr = this.event_marker_rel_pos_array.current
        rel_pos_arr.sort()
        let min_rel_dff = null
        if(rel_pos_arr.length>2){
            for(var i=0;i<(rel_pos_arr.length-1);i++){
                let diff = rel_pos_arr[i+1] - rel_pos_arr[i]
                if(min_rel_dff==null || diff < min_rel_dff){
                    min_rel_dff = diff
                } 
            }
        }

        console.log("min_rel_dff: " + min_rel_dff)

        let timeline_length
        if(min_rel_dff!=null){
            timeline_length = 50 / min_rel_dff
            console.log("newly calculated timeline_length: "+ timeline_length)

            if(timeline_length != statecopy.timeline_length){
                statecopy.timeline_length = timeline_length
            }
        }
        else{
            timeline_length = statecopy.timeline_length

        }

        const timelinewidth = this.props.timeline_width // px

        let rt_timeline_cx = containerWidth * this.props.timeline_rel_position

        statecopy.timeline_cx = rt_timeline_cx

        const tl_left = rt_timeline_cx - timelinewidth / 2

        this.timeline.style.marginTop = "30px"
        this.timeline.style.left = tl_left + 'px'
        this.timeline.style.width = timelinewidth + 'px'
        this.timeline.style.height = statecopy.timeline_length + "px"
        this.timeline.style.backgroundColor = "#000"

        // set container height
        this.container.style.height = this.timeline.offsetHeight
    }


    calculateDotMarkerRelPositions(statecopy) {

        // const timeline_height = this.props.timeline_length
        const timeline_height = statecopy.timeline_length
        let rt_marker_cy_arr = []

        this.event_marker_rel_pos_array.current.map(v => {
            rt_marker_cy_arr.push(v * timeline_height)
        })


        statecopy.marker_cy_arr = rt_marker_cy_arr
    }

    redraw(statecopy) {


        this.container.style.position = 'relative'


        this.drawTimeline(statecopy)
        this.calculateDotMarkerRelPositions(statecopy)


        if (JSON.stringify(this.state) == JSON.stringify(statecopy)) {
            console.log("compare match do nothing")
        }
        else {
            console.log("compare not match")
            this.setState(statecopy)
        }

    }


    get_event_rel_y_pos_arr() {


        let date_arr = this.props.unique_date_arr

        if (date_arr.length == 0) {
            return []
        }

        // get min max date
        let mindate = null
        let maxdate = null

        date_arr.map(d => {
            if (mindate == null || d < mindate) {
                mindate = d
            }

            if (maxdate == null || d > maxdate) {
                maxdate = d
            }
        })

        let datespan = maxdate - mindate

        var relpos = []

        date_arr.map(d => {
            relpos.push((d - mindate) / datespan)
        })

        return relpos
    }


    componentDidMount() {
        let statecopy = JSON.parse(JSON.stringify(this.state))
        this.redraw(statecopy)
    }

    componentDidUpdate() {
        let statecopy = JSON.parse(JSON.stringify(this.state))
        this.redraw(statecopy)
    }

    marker_click_handler(marker_index) {

        // find first event index from event index arr of marker index
        // console.log(this.event_index_arr_arr.current[marker_])
        let event_index = this.props.event_index_group_arr[marker_index][0]
        this.props.updateSelectedEventIndex(event_index)
    }

    event_click_handler(selected_index) {
        this.props.updateSelectedEventIndex(selected_index)
    }


    render() {

        // assign event id to all data


        // let [unique_date_arr, event_index_arr_arr] = get_date_to_event_index_list_map(this.props.data)
        // this.unique_date_arr.current = unique_date_arr
        // this.event_index_arr_arr.current = event_index_arr_arr
        // this.date_to_event_index_list_map.current = date_to_event_index_list_map

        // if there is selected event index, find unique date index that has that event index. 
        // this will be used for dot marker select bool flag

        let dot_selected_index = null
        if (this.props.selected_event_index != null) {
            for (var i = 0; i < this.props.event_index_group_arr.length; i++) {
                let include_flag = this.props.event_index_group_arr[i].includes(this.props.selected_event_index)
                if (include_flag) {
                    dot_selected_index = i
                    break
                }
            }
        }

        console.log("render triggered")

        // get rel y pos
        let date_rel_pos = this.get_event_rel_y_pos_arr()
        this.event_marker_rel_pos_array.current = date_rel_pos
        this.event_markers.current = []



        var dot_markers = this.props.unique_date_arr.map((d, i) => {

            let selected_bool = i == dot_selected_index

            let props = {
                key : 'unique' + i,
                radius : this.state.dot_marker_radius,
                cx : this.state.timeline_cx,
                cy : this.state.marker_cy_arr[i],
                selected : selected_bool,
                onclickhandler: this.marker_click_handler,
                event_index : i
            }
            return <EventMarker {...props}/>
        })

        let date_text_right_limit = this.state.timeline_cx - (this.props.timeline_width/2) - 20
        var date_textboxes = this.props.unique_date_arr.map((d, i) => {
            return <DateMarker key={"datemk" + i} cy={this.state.marker_cy_arr[i]} date={d} right_limit={date_text_right_limit} />
        })

        var box_width
        if (!this.timeline) {
            box_width = 150
        }
        else {
            box_width = this.container.offsetWidth - this.state.timeline_cx - 50
        }


        var event_slot_containers = this.props.event_index_group_arr.map((d, i) => {
            let data_arr = []
            d.forEach(v => data_arr.push(this.props.data[v]))

            let props={
                data : data_arr,
                key : "esc_" + i,
                cy : this.state.marker_cy_arr[i],
                height: 20,
                left : this.state.timeline_cx + 50,
                event_click_handler: this.event_click_handler,
                boxheight: 40,
                selected_event_index : this.props.selected_event_index,
                slotwidth : box_width
            }

            return <EventSlotContainer {...props} />
        })


        return (


            <div ref={el => this.container = el} >
                <div ref={el => this.timeline = el}></div>
                {dot_markers}
                {date_textboxes}
                {event_slot_containers}
            </div>
        )
    }
}

function get_date_to_event_index_list_map(data) {
    let visited_date_fp_arr = []
    let unique_date_arr = []
    let event_index_arr_arr = []

    if (data == null) {
        return {}
    }

    data.map((d, i) => {
        let date = d.date
        let date_fp = date.toString()

        let match_exist = false
        for (var k = 0; k < visited_date_fp_arr.length; k++) {
            if (visited_date_fp_arr[k] == date_fp) {
                match_exist = true
                break
            }
        }



        if (match_exist) {

            let j = visited_date_fp_arr.indexOf(date_fp)
            event_index_arr_arr[j].push(i)
        }
        else {
            visited_date_fp_arr.push(date_fp)
            unique_date_arr.push(date)
            event_index_arr_arr.push([i])
        }
    })


    return [unique_date_arr, event_index_arr_arr]
}