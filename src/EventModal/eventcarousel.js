import React from 'react'
import './eventcarousel.css'

export default class EventCarousel extends React.Component{


    render(){
        return(
            <div className="carousel-container">
                <div className="carousel-box">
                    {this.props.data.map((d,i)=>{
                        let classname = "carousel-box-item"
                        if(d.event_index==this.props.showindex){
                            classname += " carousel-box-item-selected"
                            
                        }

                        return <div className={classname} key={'carousel-item-'+i}
                        onClick={()=>this.props.carouselItemClickHandler(d.event_index)}
                        >{d.title.length > 30 ? d.title.slice(0,30)+'...': d.title}</div>
                    })}
                    <div style={{width:'1px', minWidth: '1px', height:'1px'}}> </div>

                    
                </div>
            </div>
        )
    }
}

