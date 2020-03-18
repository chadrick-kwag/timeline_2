import React from 'react'

import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

import axios from 'axios'


import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";


class DataEditPage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            id: props.data ? props.data._id : null,
            date: props.data ? props.data.date : null,
            title: props.data ? props.data.title : "",
            body: props.data ? props.data.body : "",
            refs: props.data ? (props.data.ref.length > 0 ? (()=>{let refs = props.data.ref
                refs.push("")
        return refs})() : [""]) : [""]
        }

        this.updateRef = this.updateRef.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.validateData = this.validateData.bind(this)
    }

    updateRef(index, newvalue) {

        console.log("inside index: " + index + ", newvalue=" + newvalue)
        let original_arr = this.state.refs
        if (index < this.state.refs.length) {

            original_arr[index] = newvalue
        }
        else if (index == this.state.refs.length) {
            original_arr.push(newvalue)
        }
        else {
            console.log("invalid index: " + index)
            return
        }

        // remove empty items
        let filter_arr = []
        original_arr.forEach(d => {
            if (d != "") filter_arr.push(d)
        })

        filter_arr.push("")


        this.setState({ refs: filter_arr })
    }

    validateData() {
        if (this.state.title == "") {
            console.log("title empty")
            return false
        }

        if (this.state.refs.length <= 1) {
            console.log('empty refs')
            console.log(this.state.refs)
            return false
        }

        return true
    }

    submitHandler() {
        // validate data
        if (!this.validateData()) {
            alert('invalid data')
            return
        }
        else {
            console.log("data validation check passed")
        }

        if (this.state.id == null) {
            // create new item

            let senddata = {
                title: this.state.title,
                date: this.state.date,
                body: this.state.body,
                refs: this.state.refs.slice(0, this.state.refs.length - 1)
            }

            console.log(senddata)

            axios({
                method: 'post',
                url: '/api/getdata',
                data: senddata
            }).then(res => {
                if (res.status == 200) {
                    this.props.updateMode('showlist')
                }
                else {
                    alert("response status = " + res.status)
                }
            }).catch(function (err) {
                console.log(err)
                alert(err)
            })
        }
        else{
            // update existing item

            let senddata = {
                id: this.state.id,
                title: this.state.title,
                date: this.state.date,
                body: this.state.body,
                refs: this.state.refs.slice(0, this.state.refs.length - 1)
            }
            console.log("senddata: ")
            console.log(senddata)

            axios.put('api/getdata', senddata)
            .then(res=>{
                if(res.status==200){
                    this.props.updateMode('showlist')
                }
                else{
                    alert(res)
                }
            })
            .catch(err=>{
                alert(err)
            })
        }


    }

    render() {


        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={e => this.props.updateMode('showlist')}>Back</Button>

                </div>
                <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                <span style={{margin: '1em'}}>date</span>
                <DatePicker selected={this.state.date} onChange={d=>{
                    console.log(d)
                    this.setState({date: d})}}/>
                </div>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>title</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control value={this.state.title} as="textarea" aria-label="With textarea" onChange={e => this.setState({ title: e.target.value })} />


                </InputGroup>
                <div style={{ height: '60%', margin: '1em' }}>

                    <Form.Control style={{ height: '100%' }} value={this.state.body} as="textarea" onChange={e => this.setState({ body: e.target.value })} />
                </div>
                <div style={{ dislay: 'flex', flexDirection: 'column', margin: '1em' }}>
                    <h2>References</h2>
                    {this.state.refs.map((d, i) => {
                        return <Form.Control value={d} as="textarea" onChange={e => this.updateRef(i, e.target.value)} />
                    })}

                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={e => this.submitHandler()}>Submit</Button>
                </div>

            </div>
        )
    }
}


class DataListupPage extends React.Component {

    render() {
        return (
            <div style={{ padding: '2em' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1em' }}>
                    <Button onClick={e => this.props.addButtonClickHandler()}>Add</Button>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <th>
                                #
                            </th>
                            <th>
                                date
                            </th>
                            <th>
                                event title
                            </th>
                            <th>
                                action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data.map((d, i) => {
                            return <tr>
                                <td>
                                    {i}
                                </td>
                                <td>
                                    {d.date.getFullYear() + '.' + (d.date.getMonth() + 1) + '.' + d.date.getDate()}
                                </td>
                                <td>
                                    {d.title}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Button onClick={e => this.props.editClickHandler(i)}>Edit</Button>
                                        <Button variant="danger" onClick={e => this.props.deleteClickHandler(i)}>Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        })}

                    </tbody>
                </Table>
            </div>
        )
    }
}


export class DataManagePage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            mode: 'showlist',
            editDataIndex: null
        }

        this.updateMode = this.updateMode.bind(this)
        this.updateEditDataIndexAndMoveToEditPage = this.updateEditDataIndexAndMoveToEditPage.bind(this)
        this.deleteDataIndex = this.deleteDataIndex.bind(this)
        this.fetchAndUpdateData = this.fetchAndUpdateData.bind(this)
        this.AddButtonClickHandler = this.AddButtonClickHandler.bind(this)


    }

    fetchAndUpdateData(lazyStateUpdates){
        console.log("lazyStateUpdates")
        console.log(lazyStateUpdates)

        axios.get('api/getdata').then(res => {
            console.log(res)

            let data = res.data

            data.forEach(d => {
                let newdate = new Date(d.date)
                d.date = newdate
            })

            console.log(data)

            if(lazyStateUpdates){
                lazyStateUpdates['data'] = data
            }
            else{
                lazyStateUpdates = {
                    data : data
                }

            }

            console.log("final lazyStateUpdates")
            console.log(lazyStateUpdates)

            this.setState(lazyStateUpdates)

        })

    }

    componentDidMount() {
        // fetch data through api
        this.fetchAndUpdateData()
    }

    updateMode(newval) {
        this.fetchAndUpdateData({mode : newval})
        // this.setState({ mode: newval })
    }


    updateEditDataIndexAndMoveToEditPage(newval) {
        this.setState({ editDataIndex: newval, mode: 'edit' })
    }

    deleteDataIndex(dataindex) {
        console.log("attempt to delete: " + this.state.data[dataindex])
        let sendid = this.state.data[dataindex]._id
        console.log("sendid: " + sendid)

        let url = 'api/getdata/' + sendid
        axios.delete(url)
            .then(res => {
                console.log(res)
                if (res.status == 200) {
                    let new_data = this.state.data
                    new_data.splice(dataindex, 1)
                    console.log("new data: " + new_data)
                    this.setState({ data: new_data })
                }
                else {
                    alert('delete status=' + res.status)
                }
            })
            .catch(function (err) {
                console.log(err)
                alert('delete error=' + err)
            })

    }



    AddButtonClickHandler(){
        this.setState({
            mode: 'edit',
            editDataIndex: null
        })
    }


    render() {

        if (this.state.mode == 'showlist') {
            return (
                <DataListupPage data={this.state.data} updateMode={this.updateMode} editClickHandler={this.updateEditDataIndexAndMoveToEditPage} deleteClickHandler={this.deleteDataIndex} addButtonClickHandler={this.AddButtonClickHandler}/>
            )
        }
        else if (this.state.mode == 'edit') {

            let dataToSend = this.state.editDataIndex == null ? null : this.state.data[this.state.editDataIndex]

            return (
                <DataEditPage data={dataToSend} updateMode={this.updateMode} />
            )
        }
        else {
            console.log("invalid mode: " + this.state.mode)
            return (
                <div>invalid show mode</div>
            )
        }
    }
}
