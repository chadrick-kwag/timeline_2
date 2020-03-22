import React from 'react'
import './eventmodal.css'

export default class EventModal extends React.Component {



    render() {

        let seldata = this.props.data[this.props.showindex]

        let formatted_date = seldata.date.getFullYear() + '/' + (seldata.date.getMonth()+1) + '/' + seldata.date.getDate()

        return (
            <div className="modal-container">
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