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
            
            console.log("formatted data: ")
            console.log(formatted_data)

            this.setState({data: formatted_data})
        })
    }


    updateSelectedEventIndex(newindex){
        console.log("update new index: ", newindex)
        this.setState({selected_event_index: newindex})
    }


    render(){

        let timelineFigureAreaProps = {
            data : this.state.data,
            updateSelectedEventIndex : this.updateSelectedEventIndex,
            selected_event_index : this.state.selected_event_index,
            timeline_rel_position : 0.2,
            timeline_length : 2000, // unit: px
            timeline_width: 10, // unit: px
        }

        return (
            
            <Container fluid>
                <Row style={{height: "100%"}}>
                    <Col style={{'overflow-x': 'scroll', 'overflow-y': 'auto', height: "100%"}}>
                    <TimelineFigureArea {...timelineFigureAreaProps}/>
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