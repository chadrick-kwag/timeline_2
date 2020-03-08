import React from 'react'

export class EventBox extends React.Component{

    constructor(props){
        super(props)
        this.onclickhandler = this.onclickhandler.bind(this)
    }

    draw(){
        this.maindiv.style.position = 'absolute'
        this.maindiv.style.offsetHeight = this.props.boxHeight + "px"
        this.maindiv.style['max-width'] = this.props.boxMaxWidth + "px"

        let top = this.props.cy - (this.props.boxHeight/2)
        this.maindiv.style.top = top + "px"

        this.maindiv.style.left = this.props.leftLimit + "px"

        if(this.props.selected){
            this.maindiv.style.fontWeight = 'bold'
        }
        else{
            this.maindiv.style.fontWeight = 'normal'
        }

        this.maindiv.style.textOverflow = 'ellipsis'
        this.maindiv.style.overflow = 'hidden'
        this.maindiv.style.whiteSpace = 'nowrap'

        console.log(this.maindiv.style)
    }


    componentDidMount(){
        this.draw()
    }

    componentDidUpdate(){
        this.draw()
    }

    onclickhandler(){
        this.props.onclickhandler(this.props.event_index)
    }

    render(){
    return <div ref={el=> this.maindiv = el} className = "card" onClick={this.onclickhandler}>
        {this.props.summaryText}</div>
    }
}