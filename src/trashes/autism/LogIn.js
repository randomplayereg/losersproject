import React from "react";
import "../leftovers/login.css";

import {Button, Container, Form, FormGroup, Input, InputGroup, InputGroupAddon, Row} from "reactstrap";
import {ruben} from "../../Ruben";

class LogIn extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            email: "",
            password: "",
            hideProgress: true,
            show: false
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({
            hideProgress: false,
            show: true
        });

        const md5Base64 = require('md5-base64');
        const encodedPassword = md5Base64(this.state.password);
        console.log('pw use md5-base64: ' + encodedPassword);

        var self = this;

        // const fetch = window.fetch.bind(window);

        let url = `https://thedung.pythonanywhere.com/api/user/login`;

        fetch(url,
            {
                method: 'POST',
                headers: {
                    'Authorization' : 'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJjcmVhdGVfdGltZSI6IjIwMTgtMDMtMDRUMDI6NTc6MjMuOTgxMjUzKzAwOjAwIiwiZW1haWwiOiJ0aGVkdW5nMjcwOUBnbWFpbC5jb20iLCJpZCI6MX0.dhZvtbK9YrUzdRObkurnRp89bCH7yy2L3sdaUbWQu0k'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: encodedPassword,
                    login_type: this.state.email,
                    fcm_token: "fzYu1WW46Rs:APA91bF5_KMWd5FJaXtjoauWzlxIFhOPcZ-BwZpsIj-keErX_6tfXlWUvWngSoj6PnLgMDcBrJ5M6YFwS370H6CPQ-YIZm3nCzwqXTEll4ug8b0oPwiFrK3m0dkO9126K5UVBzXYyL39"
                })
            })
            .then(response => response.json())
            .then(
                json => {
                    console.log(json);
                    if (json.error_code) {
                        if (json.error_code == 11) {
                            alert('Wrong email or password');
                            this.setState({
                                hideProgress: true,
                                show: false
                            })
                        }
                    } else {
                        localStorage.setItem('token', json.token);
                        localStorage.setItem('username', json.real_name);
                        localStorage.setItem('uid', json.email);

                        setTimeout(() => {
                            window.location.replace('/v2/home');
                        }, 2000);
                    }
                }
            );
    };

    render() {
        return (
            <Row className={"mt-5"}>
                <div className={"center-div"}>
                    <Form
                        onSubmit={this.handleSubmit}
                    >
                        <div style={{padding: "36px"}}>
                            <InputGroup>
                                {/*<InputGroupAddon addonType="prepend">@*/}
                                {/*</InputGroupAddon>*/}
                                <span className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" disabled>
                                        <i className="fa fa-user"></i>
                                    </button>
                                </span>
                                <Input type="email" name="email" id="email" placeholder={ruben.email} onChange={this.handleChange}/>
                            </InputGroup>
                            <InputGroup>
                                <span className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" disabled style={{border: "none", backgroundColor: "#fff"}}>
                                        <i className="fa fa-key"></i>
                                    </button>
                                </span>
                                <Input type="password" name="password" id="password" placeholder={ruben.password} onChange={this.handleChange} />
                            </InputGroup>

                            <Button type={"submit"} color="primary">primary</Button>{' '}
                        </div>
                    </Form>
                </div>
            </Row>
        );
    }
}

export default LogIn;