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

const CategoryGrid = (props) => {

    const categories = props.country.categories;

    var rend = [];
    categories.forEach(
        (category) => {
            rend.push(
                <Col md={4} >
                    <Link to={`/sharing/${props.country.id}/${category.code}/01`} className={"mt-2 card"} style={{minHeight: "204px"}}>
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

class Sharing extends Component {

    constructor(props) {
        super(props);

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
                <Container>
                    <Row>
                        <Col md={8} className={"mt-3"}>
                            <Card>
                                <CardHeader style={{color: "#fff", backgroundColor: "var(--main-purple)"}}>{ruben.english}</CardHeader>
                                <CardBody>
                                    {this.state && this.state.bundle && <CategoryGrid
                                        country={this.state.bundle[0]}
                                    />}
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader style={{color: "#fff", backgroundColor: "var(--main-purple)"}}>{ruben.vietnamese}</CardHeader>
                                <CardBody>
                                    {this.state && this.state.bundle && <CategoryGrid
                                        country={this.state.bundle[1]}
                                    />}
                                </CardBody>
                            </Card>
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

export default Sharing;
