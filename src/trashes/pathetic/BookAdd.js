import React, { Component } from 'react';
import ActionBar from "../losers/ActionBar";
import NavigationBar from "../losers/NavigationBar";
import Footer from "../losers/Footer";
import {ruben} from "../../Ruben";
import {Button, Card, CardBody, Col, Container, Form, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import StickyBox from "react-sticky-box/dist/react-sticky.esnext";

import Switch from "react-switch";

class AddComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: [true, true, true, true, true, true],
            day_number: 1,
            time_type: 'Day(s)',
            review: ""
        };
        this.availableChange = (checked, id) => {
            let tmp = this.state.checked;
            tmp[id] = checked;
            this.setState({ checked: tmp });
        }

        this.addBook = (e) => {
            e.preventDefault();
            alert('submit');

            let token = localStorage.getItem("token");
            let url = 'https://thedung.pythonanywhere.com/api/book/instance/add';

            const duration = this.state.time_type === "Day(s)" ? this.state.day_number : this.state.day_number * 7;


            fetch(
                url,
                {
                    method: "POST",
                    headers: {
                        "Authorization" : 'Token ' + token,
                        "Content-Type" : "application/json",
                    },
                    body: JSON.stringify({
                        owner: localStorage.getItem("uid"),
                        available: this.state.checked[1],
                        usage: 1,
                        duration: duration,
                        review: this.state.review,
                        original_book: this.props.id
                    })
                }
            )
                .then((response) => response.json())
                .then((json => {
                    console.log(json);
                    if (json.error_code !== null) {
                        if (json.error_code === 0) {
                            alert(ruben.add_book_succ);
                            window.location.href = '/';
                        } else {
                            alert(ruben.something_wrong)
                        }
                    }
                }));
        }

        this.onChange = (e) => {
            console.log(e.target.id + ' ' + e.target.value);
            this.setState({
                [e.target.id]: e.target.value
            })
        }
    }

    render() {
        return (
            <div className={"mt-3"}>
                <Form style={{margin: "0px 80px"}} onSubmit={this.addBook}>
                    <FormGroup row>
                        <Label for="exampleSelect" md={4}>{ruben.use_for}</Label>
                        <Input type="select" name="select" id="exampleSelect" className={"col-md-8"}>
                            <option>Lending</option>
                        </Input>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleSelect" md={4}>{ruben.time_allowed}</Label>
                        <Input type="select" name="select" id="day_number" className={"col-md-4"} onChange={this.onChange}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                        </Input>
                        <Input type="select" name="select" id="time_type" className={"col-md-4"} onChange={this.onChange}>
                            <option>Day(s)</option>
                            <option>Week(s)</option>
                        </Input>
                    </FormGroup>

                    <label htmlFor="normal-switch" className={"row"}>
                        <label style={{display: "inline"}} className={"col-md-4"}>{ruben.is_available}</label>
                        <Switch
                            className={"col-md-8"}

                            style={{display: "inline"}}
                            onChange={(checked) => this.availableChange(checked, 1)}
                            checked={this.state.checked[1]}


                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={20}
                            width={48}
                            className="react-switch"
                            id="material-switch"
                        />
                    </label>

                    {/*<FormGroup row>*/}
                        {/*<Label for="exampleSelect" md={4}>{ruben.is_available}</Label>*/}
                        {/*<Input type="checkbox" className={"col-md-8"}/>*/}
                    {/*</FormGroup>*/}
                    <FormGroup>
                        <Label for="exampleText">{ruben.review_about_this}</Label>
                        <Input type="textarea" name="text" id="review" onChange={this.onChange}/>
                    </FormGroup>

                    <Button type="submit" style={{float: "right", color: "var(--main-purple)", backgroundColor: "#ccc"}}>{ruben.save}</Button>{' '}
                </Form>
            </div>
        )
    }
}

class BookAdd extends Component {

    constructor(props) {
        super(props);

        this.fetchOriginal = () => {

            let book_id = this.props.id;
            let url = `https://thedung.pythonanywhere.com/api/book/original/${book_id}`;
            // TODO: token
            let token = `Token ${localStorage.getItem('token')}`;

            fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Authorization" : token
                    }
                }
            )
                .then((response) => response.json())
                .then((json => {
                    console.log(json);
                    // this.setState({
                    //     console.log(json);
                    // });

                    this.setState({
                        original: json
                    });

                    // this.handleClose();
                }));
        };
        this.fetchOriginal();
    }

    render() {

        return (
            <div>
                {/*<ActionBar/>*/}
                {/*<NavigationBar/>*/}
                <Container>
                    <Row>
                        <Col md={8} className={"mt-3"}>
                            {this.state && this.state.original &&
                            <Showcase
                                original={this.state.original}
                                id={this.props.id}
                            />
                            }

                            <AddComponent
                                id={this.props.id}
                                />
                        </Col>
                        <Col md={4} className={"sidebox mt-3 bg-light"}>
                            <StickyBox bottom={false}>
                                Space
                            </StickyBox>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default BookAdd;

class Showcase extends React.Component {
    constructor(props){
        super(props)
    }

    render() {

        const book = this.props.original;

        return (
            <div>
                <h1>{ruben.add_book}</h1>
                <Card style={{color: "#fff", backgroundColor: "var(--main-purple)"}}>
                    <CardBody>
                        <Row>
                            <Col md={3}>
                                <img width="100%" src={book.image} alt="Card image cap" className={""}
                                     style={{maxHeight: "200px"}}/>
                            </Col>
                            <Col md={9}>
                                <Row>
                                    <h6><b>{book.title}</b></h6>
                                </Row>
                                <Row>
                                    <h6>{`${ruben.author}: ${book.author}`}</h6>
                                </Row>
                                <Row>
                                    <h6>{`${ruben.rating}: ${book.rating}`}</h6>
                                </Row>
                                <Row>
                                    <h6>{`${ruben.translator}: ${book.translator}`}</h6>
                                </Row>
                                <Row>
                                    <h6>{`${ruben.publisher}: ${book.publisher}`}</h6>
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        )
    }
}
