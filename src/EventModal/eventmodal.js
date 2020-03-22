import React from 'react'
import './eventmodal.css'

import EventCarousel from './eventcarousel'

export default class EventModal extends React.Component {



    render() {

        let seldata = this.props.data[this.props.showindex]

        let formatted_date = seldata.date.getFullYear() + '/' + (seldata.date.getMonth() + 1) + '/' + seldata.date.getDate()

        
        
        // find index group that includes selected index
        let event_index_group = null
        for(var i=0;i<this.props.event_index_group_arr.length;i++){
            if(this.props.event_index_group_arr[i].includes(this.props.showindex)){
                event_index_group = this.props.event_index_group_arr[i]
                break
            }
        }

        console.log(event_index_group)

        let event_carousel = null

        let same_data_data_arr= event_index_group.map(i=>this.props.data[i])

        if(event_index_group.length >1){
            event_carousel = <EventCarousel data={same_data_data_arr} showindex={this.props.showindex} carouselItemClickHandler={this.props.carouselItemClickHandler}/>
        }

        return (
            <div className="modal-container">
                {event_carousel}
                <div className="modal-event-date">{formatted_date}</div>
                <div className="modal-event-title">{seldata.title}</div>
                <div className="modal-event-body">{seldata.body}</div>
                <div className="modal-event-refs">
                    {seldata.ref.map((d, i) => <a key={"refspan_" + i} target="_blank" href={d}>{d}</a>)}
                </div>
            </div>
        )
    }
}