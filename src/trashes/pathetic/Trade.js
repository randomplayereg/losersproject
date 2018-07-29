import React, { Component } from 'react';
import {
    Button, ButtonGroup,
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

import '../leftovers/filter.css';

var classNames = require('classnames');

function statusToString(status, role) {
    var res = "";
    switch (status) {
        case 5:
            res = ruben.R5;
            break;
        case 3:
            res = role === "R" ?
                ruben.R3
                :
                ruben.O3;
            break;
        case 4:
            res = role === "R" ?
                ruben.R4
                :
                ruben.O4;
            break;
        case 15:
            res = role === "R" ?
                ruben.R15
                :
                ruben.O15;
            break;
        case 6:
            res = role === "R" ?
                ruben.R6
                :
                ruben.O6;
            break;
        case 8:
            res = role === "R" ?
                ruben.R8
                :
                ruben.O8;
            break;
        case 11:
            res = role === "R" ?
                ruben.R11
                :
                ruben.O11;
            break;
        case 12:
            res = role === "R" ?
                ruben.R12
                :
                ruben.O12;
            break;
        case 16:
            res = role === "R" ?
                ruben.R16
                :
                ruben.O16;
            break;
        case 14:
            res = role === "R" ?
                ruben.R14
                :
                ruben.O14;
            break;
        default:
            break;
    }
    return res;
}

const TradeList = (props) => {
    const data = props.trades;

    let rend =[];

    data.forEach(
        (trade) => {
            rend.push(
                <Row>
                    {/*<Col md={12}>*/}
                        {/*<Link to={`/trade/${trade.id}`}>{trade.book_name}</Link>*/}
                        {/*<p>{trade.owner_email}</p>*/}
                        {/*<p>{trade.requester_email}</p>*/}
                    {/*</Col>*/}
                    <Link to={`/trade/${trade.id}`} style={{width: "100%"}} className={"card"}>
                        <CardBody style={{backgroundColor: "#fff", color: "black"}}>
                            <Row>
                                <Col md={4}>
                                    <img src={trade.book_image}/>
                                </Col>
                                <Col md={8}>
                                    <p>{trade.book_name}</p>
                                    <p>{ruben.owner}: {trade.owner_name}</p>
                                    <p>{ruben.borrower}: {trade.requester_name}</p>
                                    <p>{ruben.book_status}: {statusToString(trade.status, props.role)}</p>
                                </Col>
                            </Row>
                        </CardBody>
                    </Link>
                </Row>
            )
        }
    )

    return (
        <Container>
            {rend}
        </Container>
    )
}

class OwnerPanel extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            showCase: [],
            ownerTrades: this.props.bundle.filter((item) => {return item.owner_email === localStorage.getItem('uid')}),
            active: 1
        };


        this.filter = (i) => {
            this.setState({
                active: i
            });

            const trades = this.state.ownerTrades;

            switch (i) {
                case 1:
                    this.setState({
                        showCase: trades.filter(
                            (item) => {
                                return [3,9,11].includes(item.status)
                            }
                        )
                    })
                    break;
                case 2:
                    this.setState({
                        showCase: trades.filter(
                            (item) => {
                                return [4, 6, 8, 12, 15, 16].includes(item.status)
                            }
                        )
                    })
                    break;
                case 3:
                    this.setState({
                        showCase: trades.filter(
                            (item) => {
                                return [5, 14].includes(item.status)
                            }
                        )
                    })
                    break;
                case 4:
                    this.setState({
                        showCase: trades.filter(
                            (item) => {
                                return [10].includes(item.status)
                            }
                        )
                    })
                    break;
                default:
                    break;
            }
        }

    }

    componentDidMount() {
        this.filter(1);
    };

    render() {
        return (
            <Container>
                <ButtonGroup className={"d-flex"}>
                    <Button style={{flex: "1"}}
                            onClick={()=>this.filter(1)}
                            className={classNames({'filter-active' : this.state.active === 1}, 'filter-group')}
                    >
                        {ruben.response}
                    </Button>

                    <Button style={{flex: "1"}}
                            onClick={()=>this.filter(2)}
                            className={classNames(
                                {'filter-active' : this.state.active === 2},
                                'filter-group')
                            }
                    >
                        {ruben.on_going}
                    </Button>

                    <Button style={{flex: "1"}}
                            onClick={()=>this.filter(3)}
                            className={classNames(
                                {'filter-active' : this.state.active === 3 },
                                'filter-group')
                            }                    >
                        {ruben.finished}
                    </Button>

                    <Button style={{flex: "1"}}
                            onClick={()=>this.filter(4)}
                            className={classNames(
                            {'filter-active' : this.state.active === 4},
                            'filter-group')}
                    >
                        {ruben.queue}
                    </Button>

                </ButtonGroup>
                <Row className={"mt-3"}>
                    <TradeList
                        role="O"
                        trades={this.state.showCase}
                        />
                </Row>
            </Container>
        )
    }
}

class RequesterPanel extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            showCase: [],
            requesterTrades: this.props.bundle.filter((item) => {return item.requester_email === localStorage.getItem('uid')}),
            active: 1
        };


        this.filter = (i) => {
            this.setState({
                active: i
            });

            const trades = this.state.requesterTrades;

            switch (i) {
                case 1:
                    this.setState({
                        showCase: trades.filter(
                            (item) => {
                                return [4,12].includes(item.status)
                            }
                        )
                    })
                    break;
                case 2:
                    this.setState({
                        showCase: trades.filter(
                            (item) => {
                                return [15, 6, 8, 11, 16].includes(item.status)
                            }
                        )
                    })
                    break;
                case 3:
                    this.setState({
                        showCase: trades.filter(
                            (item) => {
                                return [5, 14].includes(item.status)
                            }
                        )
                    })
                    break;
                case 4:
                    this.setState({
                        showCase: trades.filter(
                            (item) => {
                                return [3, 9, 10].includes(item.status)
                            }
                        )
                    })
                    break;
                default:
                    break;
            }
        }

    }

    componentDidMount() {
        this.filter(1);
    };

    render() {
        return (
            <Container>
                <ButtonGroup className={"d-flex"}>
                    <Button style={{flex: "1"}}
                            onClick={()=>this.filter(1)}
                            className={classNames({'filter-active' : this.state.active === 1}, 'filter-group')}
                    >
                        {ruben.response}
                    </Button>

                    <Button style={{flex: "1"}}
                            onClick={()=>this.filter(2)}
                            className={classNames(
                                {'filter-active' : this.state.active === 2},
                                'filter-group')
                            }
                    >
                        {ruben.on_going}
                    </Button>

                    <Button style={{flex: "1"}}
                            onClick={()=>this.filter(3)}
                            className={classNames(
                                {'filter-active' : this.state.active === 3 },
                                'filter-group')
                            }                    >
                        {ruben.finished}
                    </Button>

                    <Button style={{flex: "1"}}
                            onClick={()=>this.filter(4)}
                            className={classNames(
                                {'filter-active' : this.state.active === 4},
                                'filter-group')}
                    >
                        {ruben.request}
                    </Button>

                </ButtonGroup>
                <Row className={"mt-3"}>
                    <TradeList
                        role="R"
                        trades={this.state.showCase}
                    />
                </Row>
            </Container>
        )
    }
}

class Trade extends Component {

    constructor(props) {
        super(props);

        this.fetchTrades = () => {

            let url = `https://thedung.pythonanywhere.com/api/transaction/get-all/${localStorage.getItem('uid')}`;
            // TODO: token
            let token = `Token ${localStorage.getItem("token")}`;
            // let adminToken = `Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJjcmVhdGVfdGltZSI6IjIwMTgtMDMtMDRUMDI6NTc6MjMuOTgxMjUzKzAwOjAwIiwiZW1haWwiOiJ0aGVkdW5nMjcwOUBnbWFpbC5jb20iLCJpZCI6MX0.dhZvtbK9YrUzdRObkurnRp89bCH7yy2L3sdaUbWQu0k`;

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
                    this.setState({
                        bundle: json,
                        // ownerTrades: json.filter((item) => {return item.owner_email === localStorage.getItem('uid')}),
                        // requesterTrades: json.filter((item) => {return item.owner_email !== localStorage.getItem('uid')}),
                    })
                }));
        }

        this.fetchTrades();
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

                                <CardHeader style={{color: "#fff", backgroundColor: "var(--exc-orange)"}}>{ruben.tag_owner}</CardHeader>

                                <CardBody  style={{backgroundColor: "#F8F9FA"}}>
                                    {this.state && this.state.bundle &&
                                    <OwnerPanel
                                        bundle={this.state.bundle}
                                    />
                                    }
                                </CardBody>


                            </Card>
                            <Card>

                                <CardHeader style={{color: "#fff", backgroundColor: "purple"}}>{ruben.tag_requester}</CardHeader>


                                <CardBody>
                                    {this.state && this.state.bundle &&
                                    <RequesterPanel
                                        bundle={this.state.bundle}
                                    />
                                    }
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

export default Trade;
