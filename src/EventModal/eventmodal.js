import React from 'react'
import './eventmodal.css'

import EventCarousel from './eventcarousel'
import { useSwipeable, Swipeable } from 'react-swipeable'

export default class EventModal extends React.Component {

    constructor(props){
        super(props)

        this.item_global_index_to_local_index_map = {}


        // find event index gropu that contains showindex
        let event_index_group = null
        for (var i = 0; i < this.props.event_index_group_arr.length; i++) {
            if (this.props.event_index_group_arr[i].includes(this.props.showindex)) {
                event_index_group = this.props.event_index_group_arr[i]
                break
            }
        }

        this.selected_event_index_group = event_index_group
        
        this.selected_event_index_group.map((d,i)=>{
            this.item_global_index_to_local_index_map[d]=i
        })



        this.update_local_carousel_item_index = this.update_local_carousel_item_index.bind(this)

    }


    update_local_carousel_item_index(new_index){
        if(new_index <0){
            return
        }

        if(new_index >= this.selected_event_index_group.length){
            return
        }
        let new_global_index = this.selected_event_index_group[new_index]
        this.props.carouselItemClickHandler(new_global_index)
    }

    render() {

        let seldata = this.props.data[this.props.showindex]

        let formatted_date = seldata.date.getFullYear() + '/' + (seldata.date.getMonth() + 1) + '/' + seldata.date.getDate()

        const swipe_left_fn = e=>{
            let new_index = this.item_global_index_to_local_index_map[this.props.showindex] + 1
            this.update_local_carousel_item_index(new_index)

        }

        const swipe_right_fn = e=>{
            let new_index = this.item_global_index_to_local_index_map[this.props.showindex] - 1
            this.update_local_carousel_item_index(new_index)
        }

        let event_carousel = null
        let body = null

        let same_data_data_arr = this.selected_event_index_group.map(i => this.props.data[i])

        if (this.selected_event_index_group.length > 1) {
            event_carousel = <EventCarousel data={same_data_data_arr} showindex={this.props.showindex} carouselItemClickHandler={this.props.carouselItemClickHandler} />

            body = <Swipeable onSwipedLeft={swipe_left_fn} onSwipedRight={swipe_right_fn}>
                <div className="modal-event-date">{formatted_date}</div>
                <div className="modal-event-title">{seldata.title}</div>
                <div className='modal-event-content'>
                    <div className="modal-event-body">{seldata.body}</div>
                    <div className="modal-event-refs">
                        {seldata.ref.map((d, i) => <a key={"refspan_" + i} target="_blank" href={d}>{d}</a>)}
                    </div>
                </div> </Swipeable>
        }
        else {
            event_carousel = null
            body = <div>
            <div className="modal-event-date">{formatted_date}</div>
            <div className="modal-event-title">{seldata.title}</div>
            <div className='modal-event-content'>
                <div className="modal-event-body">{seldata.body}</div>
                <div className="modal-event-refs">
                    {seldata.ref.map((d, i) => <a key={"refspan_" + i} target="_blank" href={d}>{d}</a>)}
                </div>
            </div> </div>
                
        }

        return (
            <div className="modal-container">
                {event_carousel}
                {body}

            </div>
        )
    }
}