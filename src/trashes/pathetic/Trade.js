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


const TradeList = (props) => {
    const data = props.trades;

    let rend =[];

    data.forEach(
        (trade) => {
            rend.push(
                <Container>
                    <Link to={`/trade/${trade.id}`}>{trade.book_name}</Link>
                    <p>{trade.owner_email}</p>
                    <p>{trade.requester_email}</p>
                </Container>

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
        };

        // this.init = () => {
        //     const owner_trade = this.props.bundle.filter((item) => {return item.owner_email === localStorage.getItem('uid')});
        //     this.setState({
        //         showCase: owner_trade.filter(
        //             (item) => {
        //                 return [3,9,11].includes(item.status)
        //             }
        //         )
        //     })
        // }
        // this.init();

        this.filter = (i) => {
            switch (i) {
                case 1:
                    this.setState({
                        showCase: this.state.ownerTrades.filter(
                            (item) => {
                                return [3,9,11].includes(item.status)
                            }
                        )
                    })
                    break;
                case 2:
                    this.setState({
                        showCase: this.state.ownerTrades.filter(
                            (item) => {
                                return [4, 6, 8, 12, 15, 16].includes(item.status)
                            }
                        )
                    })
                    break;
                case 3:
                    this.setState({
                        showCase: this.state.ownerTrades.filter(
                            (item) => {
                                return [4, 6, 8, 12, 15, 16].includes(item.status)
                            }
                        )
                    })
                    break;
                case 4:
                    this.setState({
                        showCase: this.state.ownerTrades.filter(
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
    }


    // const categories = props.country.categories;



    // var rend = [];
    // categories.forEach(
    //     (category) => {
    //         rend.push(
    //             <Col md={4} >
    //                 <Link to={`/sharing/${props.country.id}/${category.code}/01`} className={"mt-2 card"} style={{minHeight: "204px"}}>
    //                     <img width="100%" src={category.image} alt="Card image cap" className={"p-2"} style={{maxHeight: "154px"}}/>
    //                     <CardBody style={{padding: "0px"}}>
    //                         <CardText style={{textAlign: "center", color: "red"}}>{category.title}</CardText>
    //                     </CardBody>
    //                 </Link>
    //             </Col>
    //         )
    //     }
    // );

    render() {

        debugger

        return (
            <Container>
                <ButtonGroup className={"d-flex"}>
                    <Button style={{flex: "1"}} onClick={()=>this.filter(1)}>{ruben.response}</Button>
                    <Button style={{flex: "1"}} onClick={()=>this.filter(2)}>{ruben.on_going}</Button>
                    <Button style={{flex: "1"}} onClick={()=>this.filter(3)}>{ruben.finished}</Button>
                    <Button style={{flex: "1"}} onClick={()=>this.filter(4)}>{ruben.queue}</Button>
                </ButtonGroup>
                <Row>
                    <TradeList
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
                        bundle: json
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
                                <CardBody>
                                    {this.state && this.state.bundle && <OwnerPanel
                                        bundle={this.state.bundle}
                                    />}
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader style={{color: "#fff", backgroundColor: "purple"}}>{ruben.tag_requester}</CardHeader>
                                <CardBody>
                                    {this.state && this.state.bundle && <OwnerPanel
                                        bundle={this.state.bundle}
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

export default Trade;
