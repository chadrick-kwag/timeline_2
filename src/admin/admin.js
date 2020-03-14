import React from 'react'
import ReactDOM from 'react-dom'
import { Navbar } from 'react-bootstrap'
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

// import {BrowserRouter, Switch, Route, Link} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';



class DataEditPage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: []
        }
    }

    componentDidMount() {
        // fetch data through api
        this.setState({ data: [1, 2, 3] })
    }

    render() {
        return (
            <div style={{ padding: '2em' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button>Add</Button>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <th>
                                header
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(d => {
                            return <tr>
                                <td>
                                    {d}
                                </td>
                            </tr>
                        })}
                    </tbody>
                </Table>
            </div>
        )
    }
}

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
            return <DataEditPage />
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