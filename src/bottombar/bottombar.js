import React from 'react'

import './bottombar.css'

export default class BottomBar extends React.Component {

    render() {

        return (
            <div className="bottom-fixed-bar">
                <span style={{ color: 'white', margin: '3px' }}>Provided by LazyBastards | Contact: lazybastards4@gmail.com</span>
            </div>
        )
    }
}
