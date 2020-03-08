import React from 'react'


export class EventMarker extends React.Component{

    constructor(props){
        super(props)

        this.handleclick = this.handleclick.bind(this)

    }

    redraw(){

        var real_draw_radius
        if(this.props.selected){
            real_draw_radius = this.props.radius * 1.5
        }
        else{
            real_draw_radius = this.props.radius
        }

        this.maindiv.style.position = "absolute"
        this.maindiv.style.width = real_draw_radius *2 + "px"
        this.maindiv.style.height = real_draw_radius *2 + "px"
        this.maindiv.style.borderRadius = real_draw_radius + "px"
        this.maindiv.style.backgroundColor = "#f00"

        this.maindiv.style.left = (this.props.cx - real_draw_radius) + "px"
        this.maindiv.style.top = (this.props.cy - real_draw_radius) + "px"
    }

    componentDidMount(){
        this.redraw()
    }

    componentDidUpdate(){
        this.redraw()
    }

    handleclick(){
        console.log("clicked" )
        this.props.onclickhandler(this.props.event_index)
    }

    render(){
        return (
            <div ref={el=> this.maindiv = el} onClick={this.handleclick}></div>
        )
    }
}
