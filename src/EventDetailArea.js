import React from 'react'


export class EventDetailArea extends React.Component{

    render(){

        var title_text_fn = ()=>{
            if(this.props.showindex==null){
                return ""
            }
            else{
                return this.props.data[this.props.showindex].event_title
            }
        }

        var body_text_fn = ()=>{
            if(this.props.showindex==null){
                return ""
            }
            else{
                return this.props.data[this.props.showindex].body
            }
        }

        var ref_content = ()=>{
            if(this.props.showindex==null){
                return
            }
            else{
                let ref_arr = this.props.data[this.props.showindex].ref

                let ret_arr=[]
                ref_arr.forEach(r=>{
                ret_arr.push(<a href={r} target="_blank">{r}</a>)
                })

                return ret_arr
            }
        }

        return (
        <div className="event-detail-area-container">
            <div className="event-detail-title" style={{padding: "1em"}}><h1>{title_text_fn()}</h1></div>
            <div className="event-detail-body">
                <div style={{padding: "1em"}}>
                    {body_text_fn()}
                </div>
                <div style={{ padding: "1em"}}>
                    {ref_content()}
                </div>
            </div>
            
        </div>
        )
    }
}
