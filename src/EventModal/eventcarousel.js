import React from 'react'
import './eventcarousel.css'

export default class EventCarousel extends React.Component{

    constructor(props){
        super(props)
        this.moveScroll = this.moveScroll.bind(this)
    }


    moveScroll(){
        let scrollToIndex = null
        for(var i=0;i<this.props.data.length;i++){
            if(this.props.data[i].event_index==this.props.showindex){
                scrollToIndex = i
                break
            }
        }

        if(scrollToIndex!=null){
            let elm = document.getElementById('carousel-box-item-'+scrollToIndex)

            console.log(elm)
            console.log(elm.offsetLeft)

            let leftOffset = elm.offsetLeft
            console.log(this.carouselBoxDiv)

            leftOffset = leftOffset - this.carouselBoxDiv.offsetWidth/2 + elm.offsetWidth/2

            
            this.carouselBoxDiv.scrollLeft = leftOffset

            // if(elm!=null){
            //     elm.scrollIntoView()
            // }
        }
    }


    componentDidMount(){
        this.moveScroll()
    }

    componentDidUpdate(){
        this.moveScroll()
    }


    render(){
        return(
            <div  className="carousel-container">
                <div ref={el=>this.carouselBoxDiv=el}  className="carousel-box">
                    {this.props.data.map((d,i)=>{

                        let idname = "carousel-box-item-"+i

                        let classname = "carousel-box-item"
                        if(d.event_index==this.props.showindex){
                            classname += " carousel-box-item-selected"
                            
                        }

                        return <div id={idname} className={classname} key={'carousel-item-'+i}
                        onClick={()=>this.props.carouselItemClickHandler(d.event_index)}
                        >{d.title.length > 30 ? d.title.slice(0,30)+'...': d.title}</div>
                    })}
                    <div style={{width:'1px', minWidth: '1px', height:'1px'}}> </div>

                    
                </div>
            </div>
        )
    }
}

