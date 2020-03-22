import React from 'react'
import ReactDOM from 'react-dom'
import { Modal, Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css'
import { TimelineFigureArea } from './TimelineFigureArea.js'
import axios from 'axios'
import { EventDetailArea } from './EventDetailArea.js'

import Backdrop from './backdrop/Backdrop.js'



class TopBar extends React.Component {

    render() {

        return (
            <div className="top-bar">
                <span style={{ color: '#fff', fontSize: '2em' }}>코로나 정부대책 정리</span>

            </div>

        )
    }
}


class BottomBar extends React.Component {

    render() {

        return (
            <div className="bottom-fixed-bar">
                <span style={{ color: 'white', margin: '3px' }}>Provided by LazyBastards | Contact: lazybastards4@gmail.com</span>
            </div>
        )
    }
}



class TimeLineWorkSpace extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            unique_date_arr: [],
            event_index_group_arr: [],
            selected_event_index: null,
            showModal: false
        }

        this.updateSelectedEventIndex = this.updateSelectedEventIndex.bind(this)
    }

    componentDidMount() {
        axios.get('api/getdata').then(res => {
            console.log(res)


            let formatted_data = res.data.map((d, i) => {
                d.event_title = d.title

                let convdate = new Date(d.date)
                convdate.setHours(0)
                convdate.setMinutes(0)
                convdate.setSeconds(0)
                d.date = convdate
                return d
            })

            formatted_data.sort((a, b) => { return a.date - b.date })

            formatted_data.forEach((d, i) => d.event_index = i)

            // sort and init data structured data
            let [unique_date_arr, event_index_group_arr] = get_date_to_event_index_list_map(formatted_data)

            this.setState({
                data: formatted_data,
                unique_date_arr: unique_date_arr,
                event_index_group_arr: event_index_group_arr
            })
        })
            .catch(err => {
                console.log(err)
                alert(err)
            })
    }


    updateSelectedEventIndex(newindex) {
        console.log("update new index: ", newindex)

        let newstate = {
            selected_event_index: newindex
        }

        if (this.props.smallMode) {
            newstate.showModal = true
        }
        this.setState(newstate)
    }


    render() {

        console.log('smallmode: ' + this.props.smallMode)

        let timelineFigureAreaProps = {
            data: this.state.data,
            unique_date_arr: this.state.unique_date_arr,
            event_index_group_arr: this.state.event_index_group_arr,
            updateSelectedEventIndex: this.updateSelectedEventIndex,
            selected_event_index: this.state.selected_event_index,
            timeline_rel_position: 0.2,
            timeline_length: 2000, // unit: px
            timeline_width: 5, // unit: px
        }

        let timeLineFigureAreaWidth = this.props.smallMode ? '100%' : '50%'




        return (

            <Container fluid style={{ height: this.props.height }}>
                <Row >
                    <Col style={{ 'overflow-y': 'auto', height: this.props.height, maxWidth: timeLineFigureAreaWidth }} className="scrollbar">
                        <TimelineFigureArea {...timelineFigureAreaProps} />
                    </Col>
                    {this.props.smallMode ? null : <Col style={{ maxWidth: '50%' }}>
                        <EventDetailArea showindex={this.state.selected_event_index} data={this.state.data} event_index_group_arr={this.state.event_index_group_arr} cardClickHandler={this.updateSelectedEventIndex} height={this.props.height} />
                    </Col>}

                </Row>

                {this.props.smallMode && this.state.showModal?
                    <Backdrop clickHandler={()=>{this.setState({showModal: false})}}/>

                    : null
                }
            </Container>

        )
    }
}


class App extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            timeWorkSpaceHeight: 0,
            showModal: false
        }

        this.afterRender = this.afterRender.bind(this)
    }

    afterRender() {

        // adust main height if necessary
        var mainheight = 0

        let windowheight = document.documentElement.clientHeight
        console.log("windowheight: " + windowheight)

        let topbarheight = document.getElementById('top-bar').offsetHeight

        console.log("innerheight: " + window.innerHeight)
        mainheight = windowheight - (16 * 2) - topbarheight
        console.log("new mainheight: " + mainheight)

        if (mainheight != this.state.timeWorkSpaceHeight) {
            this.setState({ timeWorkSpaceHeight: mainheight })
        }

    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            console.log("resize handler triggered")
            this.forceUpdate()
            this.afterRender()
        })

        this.afterRender()
    }

    componentDidUpdate() {
        this.afterRender()
    }

    render() {

        let innerwidth = window.innerWidth
        console.log('in render, innerwidth: ' + innerWidth)
        let innerheight = window.innerHeight



        // get height of fixed top bar
        let topbar = document.getElementById('top-bar')
        let topbarheight = topbar.offsetHeight

        console.log('topbarheight: ' + topbarheight)

        return (<div>

            <div style={{ height: topbarheight + 'px' }}> </div>


            <TimeLineWorkSpace height={this.state.timeWorkSpaceHeight} smallMode={innerwidth < 1000 ? true : false} />

            <div style={{ minHeight: '2em', maxHeight: '2em' }}></div>

            <BottomBar />
        </div>)
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)




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