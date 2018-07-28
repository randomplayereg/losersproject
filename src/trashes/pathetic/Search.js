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
    Container,
    Row, Table
} from "reactstrap";
import {ruben} from "../../Ruben";
import StickyBox from "react-sticky-box/dist/react-sticky.esnext";
import {Link} from "react-router-dom";

const Result = (props) => {

    const books = props.books;

    var rend = [];
    books.forEach(
        (book) => {
            rend.push(
                <Col md={4}>
                    <Link to={`/book/${book.id}`} className={"mt-2 card"} style={{minHeight: "204px", backgroundColor: "var(--main-purple)"}}>
                        <img width="100%" src={book.image} alt="Card image cap" className={"p-2"} style={{maxHeight: "300px"}}/>
                        <CardBody style={{padding: "0px"}}>
                            <CardText style={{color: "white"}}>{book.title}</CardText>
                            <CardText style={{color: "white"}}>{book.author}</CardText>
                            <CardText style={{color: "white"}}>{book.rating}</CardText>
                        </CardBody>
                    </Link>
                </Col>
            )
        }
    );

    return (
        <Row>
            {rend.length > 0 ? rend : <h6>{ruben.not_found}</h6>}
        </Row>
    )
}


class Search extends React.Component {

    constructor(props) {
        super(props);
        this.fetchBooks = () => {


            debugger
            const key = this.props.match.params.key;
            let url = `https://thedung.pythonanywhere.com/api/book/search/original`;
            // TODO: token
            let token = `Token ${localStorage.getItem('token')}`;

            fetch(
                url,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : token,
                        "Content-Type" : "application/x-www-form-urlencoded"
                    },
                    body: prepareData({
                        'key': key
                    })
                }
            )
                .then((response) => response.json())
                .then((json => {
                    console.log(json);

                    this.setState({
                        books: json
                    });

                }));
        };

        this.fetchBooks();
    }

    render() {

        // const vnCategories = this.state.bundle[0];
        // const enCategories = this.state.bundle[1];

        return (
            <div>
                <Container>
                    <Row>
                        <Col md={8} className={"mt-3"}>
                            {this.state && this.state.books &&
                                <Result
                                    books={this.state.books}
                                />
                            }
                        </Col>
                        <Col md={4} className={"sidebox mt-3 bg-light"}>
                            <StickyBox bottom={false}>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>
                                            <Button color={"primary"}>{ruben.send_feedback}</Button>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>@mdo</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </StickyBox>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Search;


function prepareData(details) {
    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
}