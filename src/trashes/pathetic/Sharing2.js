import React, { Component } from 'react';
import {
    Button,
    Card,
    CardBody,
    CardDeck, CardFooter, CardHeader,
    CardImg,
    CardSubtitle,
    CardText,
    CardTitle,
    Col,
    Container, Nav, NavItem, NavLink,
    Row, Table
} from "reactstrap";
import {ruben} from "../../Ruben";
import StickyBox from "react-sticky-box/dist/react-sticky.esnext";
import {Link} from "react-router-dom";

import '../leftovers/subcategory.css';

const CategoryGrid = (props) => {

    const categories = props.country.categories;

    var rend = [];
    categories.forEach(
        (category) => {
            rend.push(
                <Col md={4} >
                    <Link to={`/sharing/${props.country.id}/${category.code}`} className={"mt-2 card"} style={{minHeight: "204px"}}>
                        <img width="100%" src={category.image} alt="Card image cap" className={"p-2"} style={{maxHeight: "154px"}}/>
                        <CardBody style={{padding: "0px"}}>
                            <CardText style={{textAlign: "center", color: "red"}}>{category.title}</CardText>
                        </CardBody>
                    </Link>
                </Col>
            )
        }
    );

    return (
        <Row>
            {rend}
        </Row>
    )
}

const SubcategoryNav = (props) => {

    const data = props.bundle;
    const countryCode = props.countryCode;
    const categoryCode = props.categoryCode;

    let rend = [];

    data.forEach(
        (country) => {
            if (country.id === countryCode) {
                country.categories.forEach(
                    (category) => {
                        if (category.code === categoryCode) {
                            category.subs.forEach(
                                (subcategory) => {
                                    rend.push(
                                        <NavItem key={subcategory.code}>
                                            <Link to={`${subcategory.code}`} className={"nav-link link-item"}>{subcategory.title}</Link>
                                        </NavItem>
                                    )
                                }
                            )
                        }
                    }
                )
            }
        }
    )

    return (
        <Nav vertical className={"mt-3"}>
            {rend}
        </Nav>
    )
}

const BookGrid = (props) => {

    const data = props.bundle;
    const countryCode = props.countryCode;
    const categoryCode = props.categoryCode;
    const subcategoryCode = props.subcategoryCode;

    let rend = [];

    data.forEach(
        (country) => {
            if (country.id === countryCode) {
                country.categories.forEach(
                    (category) => {
                        if (category.code === categoryCode) {
                            category.subs.forEach(
                                (subcategory) => {
                                    if (subcategory.code === subcategoryCode) {
                                        subcategory.books.forEach(
                                            (book) => {
                                                rend.push(
                                                    <Col md={4}>
                                                        <Link to={`/book/${book.id}`} className={"mt-2 card"} style={{minHeight: "204px", backgroundColor: "var(--main-purple)"}}>
                                                            <img width="100%" src={book.image} alt="Card image cap" className={"p-2"} style={{maxHeight: "300px"}}/>
                                                            <CardBody>
                                                                <CardText style={{color: "white"}}>{book.title}</CardText>
                                                                <CardText style={{color: "white"}}><strong>{ruben.author}:</strong>  {book.author}</CardText>
                                                                <CardText style={{color: "white"}}><strong>{ruben.rating}:</strong>  {book.rating}</CardText>
                                                            </CardBody>
                                                        </Link>
                                                    </Col>
                                                )
                                            }
                                        )
                                    }
                                }
                            )
                        }
                    }
                )
            }
        }
    )

    return (
        <Row>
            {rend}
        </Row>
    )
}

class Sharing2 extends Component {

    constructor(props) {
        super(props);

        // this.state = {
        //     bundle: []
        // }

        this.fetchBookData = () => {

            let url = `https://thedung.pythonanywhere.com/api/book/web/all`;
            // TODO: token
            let adminToken = `Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJjcmVhdGVfdGltZSI6IjIwMTgtMDMtMDRUMDI6NTc6MjMuOTgxMjUzKzAwOjAwIiwiZW1haWwiOiJ0aGVkdW5nMjcwOUBnbWFpbC5jb20iLCJpZCI6MX0.dhZvtbK9YrUzdRObkurnRp89bCH7yy2L3sdaUbWQu0k`;

            fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Authorization" : adminToken
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
                        bundle: json
                    });

                    // this.handleClose();
                }));
        }

        this.fetchBookData();
    }

    render() {

        // const vnCategories = this.state.bundle[0];
        // const enCategories = this.state.bundle[1];

        return (
            <div>
                <Container className={"mt-3"}>
                    {/*<Row>*/}
                        {/*<Col md={12}>*/}
                            {/*<h1>{this.props.country}{this.props.category}{this.props.subcategory}</h1>*/}
                        {/*</Col>*/}
                    {/*</Row>*/}
                    <Row>
                        {this.state && this.state.bundle &&
                        <Col md={2} className={"custom-light-grey"}>
                            <SubcategoryNav
                                bundle={this.state.bundle}
                                countryCode={this.props.country}
                                categoryCode={this.props.category}
                            />
                        </Col>
                        }
                        {this.state && this.state.bundle &&
                        <Col md={10}>
                            <BookGrid
                                bundle={this.state.bundle}
                                countryCode={this.props.country}
                                categoryCode={this.props.category}
                                subcategoryCode={this.props.subcategory}
                            />
                        </Col>
                        }
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Sharing2;
