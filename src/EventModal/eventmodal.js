import React from 'react'
import './eventmodal.css'

export default class EventModal extends React.Component {



    render() {

        let seldata = this.props.data[this.props.showindex]

        return (
            <div className="modal-container">
                <div className="modal-event-title">{seldata.title}</div>
                <div className="modal-event-body">{seldata.body}</div>
                <div className="modal-event-refs">
                    {seldata.ref.map((d, i) => <span key={"refspan_" + i}>{d}</span>)}
                </div>
            </div>
        )
    }
}