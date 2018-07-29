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
    Container, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink,
    Row, Table
} from "reactstrap";
import {ruben} from "../../Ruben";
import StickyBox from "react-sticky-box/dist/react-sticky.esnext";
import {Link} from "react-router-dom";

class Book extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }

        this.toggle = (chosenInstance) => {
            this.setState({
                isOpen: !this.state.isOpen,
                chosenInstance: chosenInstance
            })
        }

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

        this.fetchInstance = () => {
            let book_id = this.props.id;
            let url = `https://thedung.pythonanywhere.com/api/book/instance/${book_id}`;
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
                        instances: json
                    });

                    // this.handleClose();
                }));
        }
        this.fetchInstance();

    }

    render() {

        // const vnCategories = this.state.bundle[0];
        // const enCategories = this.state.bundle[1];

        return (
            <div>
                {/*<ActionBar/>*/}
                {/*<NavigationBar/>*/}
                <Container>
                    <Row>
                        <Col md={6} className={"mt-3"}>
                            {this.state && this.state.original &&
                            <Showcase
                                original={this.state.original}
                                id={this.props.id}
                            />
                            }
                        </Col>


                        {/*modal*/}
                        {this.state && this.state.chosenInstance &&
                        <RequestModal
                            toggle={this.toggle}
                            isOpen={this.state.isOpen}
                            email={localStorage.getItem("uid")}
                            instance={this.state.chosenInstance}
                        />
                        }
                        {/*modal*/}

                        <Col md={6} className={"sidebox mt-3"} style={{backgroundColor: "var(--main-purple)"}}>
                            <StickyBox bottom={false}>
                                {this.state && this.state.instances &&
                                <Owners
                                    instances={this.state.instances}
                                    toggle={this.toggle}
                                />
                                }
                            </StickyBox>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default Book;

class Showcase extends React.Component {
    constructor(props){
        super(props)
    }

    render() {

        const book = this.props.original;

        return (
            <div>
                <Card style={{color: "#fff", backgroundColor: "var(--main-purple)"}}>
                    <CardBody>
                        <Row>
                            <Col md={3}>
                                <img width="100%" src={book.image} alt="Card image cap" className={""} style={{maxHeight: "200px"}}/>
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

                <Row>
                    <p>{book.number_exchange} {ruben.books_are_available}</p>
                </Row>

                <Row>
                    <Col md={12}>
                        <Link to={`/book/${this.props.id}/add`} className={"btn btn-outline-primary"}>{ruben.add_this}</Link>
                        <Button outline color="primary">{ruben.borrow_this}</Button>{' '}
                    </Col>
                </Row>

                <Row>
                    <h5><u>{ruben.detail}</u></h5>
                </Row>
                <Row>
                    <h5>{ruben.size}: {parseFloat(book.size_height).toFixed(1)} x {parseFloat(book.size_width).toFixed(1)} cm</h5>
                </Row>
                <Row>
                    <h5>{ruben.weight}: {book.weight} g</h5>
                </Row>
                <Row>
                    <h5>{ruben.total_pages}: {book.total_page}</h5>
                </Row>
                <Row>
                    <h5>{ruben.publish_date}: {convertTime(book.publish_date)}</h5>
                </Row>
                <Row>
                    <h5><u>{ruben.summary}</u></h5>
                </Row>
                <Row>
                    <h5>{book.summary}</h5>
                </Row>
            </div>

        )
    }
}

class Owners extends React.Component {
    constructor(props){
        super(props);

    }

    render() {

        const instances = this.props.instances;

        let rend = [];

        instances.forEach(
            (ins) => {
                rend.push(
                    <Row className={"mt-3"}>

                        <Col md={12}>
                            <Card style={{color: "#000", backgroundColor: "#fff"}} key={ins.book.code}>
                                <CardBody>
                                    <Row>
                                        <Col md={4}>
                                            <img width="100%" src={ins.user.avatar} alt="Card image cap" className={""} style={{maxHeight: "200px"}}/>
                                        </Col>
                                        <Col md={5}>
                                            <h6>{ins.user.real_name}</h6>
                                        </Col>
                                        <Col md={3}>
                                            <Button color={"green"} onClick={()=>this.props.toggle(ins)}>{ruben.borrow}</Button>
                                        </Col>
                                    </Row>

                                    <tr className={"row"}>
                                        <td className={"col-md-4"}>{ruben.owner_address}:</td>
                                        <td className={"col-md-8"}>{printAddress(ins.book.location)}</td>
                                    </tr>
                                    <tr className={"row"}>
                                        <td className={"col-md-4"}>{ruben.use_for}:</td>
                                        <td className={"col-md-8"}>{ruben.borrow}</td>
                                    </tr>
                                    <tr className={"row"}>
                                        <td className={"col-md-4"}>{ruben.time_allowed}:</td>
                                        <td className={"col-md-8"}>{printDuration(ins.book.duration)}</td>
                                    </tr>
                                    <tr className={"row"}>
                                        <td className={"col-md-4"}>{ruben.is_available}:</td>
                                        <td className={"col-md-8"}>{ins.book.available ? ruben.yes : ruben.no}</td>
                                    </tr>

                                    <Row>
                                        <p className={"col-md-12"}>{ruben.related_content}</p>
                                    </Row>
                                    <Row>
                                        <p className={"col-md-12"}>{ins.book.tag}</p>
                                    </Row>
                                    <Row>
                                        <p className={"col-md-12"}>{ruben.owner_review}</p>
                                    </Row>
                                    <Row>
                                        <p className={"col-md-12"}>{ins.book.review}</p>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )
            }
        )

        return (
            <div>
                <p>{ruben.member_sharing}</p>

                {rend}
            </div>
        )
    }
}

class RequestModal extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            message: ruben.can_i_borrow,
        }

        this.onChange = (e) => {
            this.setState({
                [e.target.id]: e.target.value
            })
        }
        // this.googleChecker = this.googleChecker.bind(this);
        this.getGoogleMaps = this.getGoogleMaps.bind(this);
        this.initMap = this.initMap.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
    }

    getGoogleMaps() {
        // If we haven't already defined the promise, define it
        if (!this.googleMapsPromise) {
            this.googleMapsPromise = new Promise((resolve) => {
                // Add a global handler for when the API finishes loading
                window.resolveGoogleMapsPromise = () => {
                    // Resolve the promise
                    resolve(window.google);

                    // Tidy up
                    delete window.resolveGoogleMapsPromise;
                };

                // Load the Google Maps API
                this.initMap();
            });
        }

        // Return a promise for the Google Maps API
        return this.googleMapsPromise;
    }

    // googleChecker() {
    //     // check for maps in case you're using other google api
    //     if(!window.google.maps) {
    //         setTimeout(this.googleChecker, 100);
    //         console.log("not there yet");
    //     } else {
    //         console.log("we're good to go!!");
    //         // the google maps api is ready to use, render the map
    //         this.initMap();
    //     }
    // }

    initMap(){
        // const coords = { lat: 41.375885, lng: 2.177813 };
        // debugger
        const coords = { lat: this.props.instance.book.location.lat, lng: this.props.instance.book.location.lng };
        // create map instance
        // new window.google.maps.Map(document.getElementById('mapContainer'), {
        var map = new window.google.maps.Map(this.refs.mapContainer, {
            zoom: 16,
            center: {
                lat: coords.lat,
                lng: coords.lng
            }
        });

        var marker = new window.google.maps.Marker({position: coords, map: map});
    }

    sendRequest() {

        let url = `https://thedung.pythonanywhere.com/api/transaction/request-book`;
        let token = `Token ${localStorage.getItem('token')}`;

        fetch(
            url,
            {
                method: "PUT",
                headers: {
                    "Authorization" : token
                },
                body: formEncoded({
                    'email' : localStorage.getItem("uid"),
                    'code' : this.props.instance.book.code
                })
            }
        )
            .then(
                (response) => {
                    debugger
                    return response.json();
                }
            )
            .then((json => {
                if (json.id !== null) {
                    alert(ruben.success);
                    window.location.href = "/trade";
                }
                console.log(json);
            }));
    }

    componentDidMount(){
        this.getGoogleMaps();
    }

    render() {
        return(
            <div>
                <Modal isOpen={this.props.isOpen}
                       // modalTransition={{ timeout: 700 }}
                       // backdropTransition={{ timeout: 1300 }}
                       toggle={()=>this.props.toggle(this.props.instances)}
                       className={"modal-lg"}
                >
                    {/*<ModalHeader toggle={this.props.toggle}>Modal title</ModalHeader>*/}
                    <ModalBody>
                        <Col md={12}>
                            <Row>
                                {ruben.owner_address}: {printAddress(this.props.instance.book.location)}
                            </Row>

                            <Row>
                                <div ref="mapContainer" style={{width: "100%", height: "300px"}}/>
                            </Row>


                            <Row className={"mt-3"}>
                                <FormGroup style={{width: "100%"}}>
                                    {/*<Label for="exampleText">{ruben.review_about_this}</Label>*/}
                                    <Input type="textarea" name="text" id="message" value={this.state.message} onChange={this.onChange}/>
                                </FormGroup>
                            </Row>

                            <Row>
                                <Button style={{float: 'right'}} color="primary" onClick={this.sendRequest}>{ruben.request}</Button>{' '}
                            </Row>
                        </Col>

                    </ModalBody>
                    {/*<ModalFooter>*/}
                        {/*<Button color="secondary" onClick={this.props.toggle}>Cancel</Button>*/}
                    {/*</ModalFooter>*/}
                </Modal>
            </div>
        )
    }
}

function convertTime(raw) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    // parseFloat(raw);
    var date = new Date(raw*1000);

    date.setDate(date.getDate() - 1);
// Hours part from the timestamp
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
// Minutes part from the timestamp
    var month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
// Seconds part from the timestamp
    var year = date.getFullYear();

// Will display time in 10:30:23 format
    var formattedTime = year + '-' + month + '-' + day;
    return formattedTime;
}

function printAddress(location) {
    return `${location.detail}, ${location.ward}, ${location.district}, ${location.city}, ${location.country}`;
}

function printDuration(duration) {
    return duration % 7 === 0 ? `${duration/7} ${ruben.week}` : `${duration} ${ruben.day}`
}

function formEncoded(details) {
    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
}