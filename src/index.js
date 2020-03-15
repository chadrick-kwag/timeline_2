import React from 'react'
import ReactDOM from 'react-dom'
import {Container, Row, Col} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css'
import {TimelineFigureArea} from './TimelineFigureArea.js'
import axios from 'axios'
import {EventDetailArea} from './EventDetailArea.js'







class TimeLineWorkSpace extends React.Component{

    constructor(props){
        super(props)
        this.state={
            data: [],
            unique_date_arr: [],
            event_index_group_arr: [],
            selected_event_index : null
        }

        this.updateSelectedEventIndex = this.updateSelectedEventIndex.bind(this)
    }

    componentDidMount(){
        axios.get('api/getdata').then(res=>{
            console.log(res)
            
            
            let formatted_data = res.data.map((d,i)=>{
                d.event_title = d.title

                let convdate = new Date(d.date)
                // console.log(convdate)
                d.date = convdate
                d.event_index = i
                return d
            })

            // sort and init data structured data
            let [unique_date_arr, event_index_group_arr] = get_date_to_event_index_list_map(formatted_data)
            

            
            console.log("formatted data: ")
            console.log(formatted_data)

            this.setState({
                data: formatted_data,
                unique_date_arr: unique_date_arr,
                event_index_group_arr : event_index_group_arr
            })
        })
        .catch(err=>{
            console.log(err)
            alert(err)
        })
    }


    updateSelectedEventIndex(newindex){
        console.log("update new index: ", newindex)
        this.setState({selected_event_index: newindex})
    }


    render(){

        let timelineFigureAreaProps = {
            data : this.state.data,
            unique_date_arr: this.state.unique_date_arr,
            event_index_group_arr: this.state.event_index_group_arr,
            updateSelectedEventIndex : this.updateSelectedEventIndex,
            selected_event_index : this.state.selected_event_index,
            timeline_rel_position : 0.2,
            timeline_length : 2000, // unit: px
            timeline_width: 10, // unit: px
        }

        return (
            
            <Container fluid>
                <Row style={{height: "100%"}}>
                    <Col style={{'overflow-x': 'scroll', 'overflow-y': 'auto', height: "100%", maxWidth: '50%'}}>
                    <TimelineFigureArea {...timelineFigureAreaProps}/>
                    </Col>
                    <Col style={{maxWidth: '50%'}}>
                    <EventDetailArea showindex={this.state.selected_event_index} data={this.state.data} event_index_group_arr={this.state.event_index_group_arr} cardClickHandler={this.updateSelectedEventIndex}/>
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