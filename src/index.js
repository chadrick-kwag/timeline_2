import React from 'react'
import ReactDOM from 'react-dom'
import {Container, Row, Col} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css'
import {TimelineFigureArea} from './TimelineFigureArea.js'
import axios from 'axios'


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






class TimeLineWorkSpace extends React.Component{

    constructor(props){
        super(props)
        this.state={
            data: [
                // {
                //     "date": new Date(2020,0,1),
                //     "event_title": "first event"
                // },
                // {
                //     "date": new Date(2020,0,2),
                //     "event_title": "second event"
                // },
                // {
                //     "date": new Date(2020,0,15),
                //     "event_title": "last event"
                // }
            ],
            selected_event_index : null
        }

        this.updateSelectedEventIndex = this.updateSelectedEventIndex.bind(this)
    }

    componentDidMount(){
        axios.get('api/getdata').then(res=>{
            console.log(res)
            
            
            let formatted_data = res.data.map(d=>{
                d.event_title = d.title

                let convdate = new Date(d.date)
                console.log(convdate)
                d.date = convdate
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
        return (
            
            <Container fluid>
                <Row>
                    <Col>
                    <TimelineFigureArea data = {this.state.data} updateSelectedEventIndex = {this.updateSelectedEventIndex} selected_event_index={this.state.selected_event_index}/>
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