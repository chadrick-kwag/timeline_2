import React from 'react'
import ReactDOM from 'react-dom'
import { Navbar } from 'react-bootstrap'
import Nav from 'react-bootstrap/Nav'



import 'bootstrap/dist/css/bootstrap.min.css';
import {DataManagePage} from './DataEditPage.js'



class AdminApp extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            view: null
        }

        this.showMainArea = this.showMainArea.bind(this)
    }


    showMainArea() {
        console.log(this.state.view)
        if (this.state.view == null) {
            return <div>null page</div>
        }
        else if (this.state.view == 'data') {
            return <DataManagePage />
        }
        else if (this.state.view == 'home') {
            return <div>this is home page</div>
        }

    }


    render() {

        return (
            <div>
                <Navbar bg='light' >
                    <Nav onSelect={(e) => { this.setState({ view: e }) }}>
                        <Nav.Item>
                            <Nav.Link eventKey='home'>Home</Nav.Link></Nav.Item>
                        <Nav.Item>

                            <Nav.Link eventKey='data'>Data</Nav.Link>
                        </Nav.Item>

                    </Nav>

                </Navbar>

                {this.showMainArea()}

            </div>

        )

    }
}



ReactDOM.render(
    <AdminApp />,
    document.getElementById('app')
)