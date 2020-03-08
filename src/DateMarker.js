import React from 'react'

export class DateMarker extends React.Component{

    constructor(props){
        super(props)

        this.format_date_to_str = this.format_date_to_str.bind(this)

    }


    draw(){
        this.maindiv.style.position = 'absolute'
        let textwidth = this.textspan.offsetWidth
        let textheight = this.textspan.offsetHeight

        let top = this.props.cy - (textheight/2)

        this.maindiv.style.top = top

        this.textspan.style.color = "#000"
        
        
    }

    componentDidMount(){
        this.draw()
    }

    componentDidUpdate(){
        this.draw()
    }

    format_date_to_str(){
        console.log(this.props.date)
        let year = this.props.date.getFullYear()
        let month = this.props.date.getMonth() +1
        let day = this.props.date.getDate()

        return year + "/" + month + "/" + day
    }

    render(){
        return (
            <div ref={el=>this.maindiv = el}>
                <span ref={el => this.textspan = el}>{this.format_date_to_str(this.props.date)}</span>
            </div>
        )
    }
}