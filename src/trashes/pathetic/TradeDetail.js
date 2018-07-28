import React from 'react';

import { Box, Text } from 'react-desktop/macOs';

import Geocode from "../cripple/Geocode";

import {Sidebar} from 'primereact/sidebar';

import {geolocated} from 'react-geolocated';
import {
    Button,
    Col,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    FormGroup,
    Input, Label, Modal, ModalBody, ModalFooter, ModalHeader,
    Row
} from "reactstrap";

import {ruben} from "../../Ruben";


const TradeInfo = (props) => {

    // TODO: check dang nhap
    const currentEmail = localStorage.getItem('uid');

    const styles = {
        infoContainer: {
            padding: '0px 0px',
            backgroundColor: '#9b859b'
        }
    };

    return (
        [
            <Row className="title-activity">
                <h2 style={{margin: 'auto'}}>Chi tiết giao dịch</h2>
            </Row>,
            <Row style={styles.infoContainer}>
                {/*<Col md={12} style={styles.infoContainer}>*/}
                <Col md={5} style={{margin: 'auto'}}>
                    <div style={{display: 'flex'}}>
                        <img src={props.info.book_image} thumbnail style={{margin: 'auto'}}/>
                    </div>
                </Col>
                <Col md={7}>
                    <Row>
                        <h4><strong>{props.info.book_name}</strong></h4>
                    </Row>

                    <Row>
                        <h4>Chủ sở hữu: {props.info.owner_name}</h4>
                    </Row>

                    <Row>
                        <h4>Người mượn: {props.info.requester_name}</h4>
                    </Row>

                    <Row>
                        <h4>Trạng thái sách: {props.info.status}</h4>
                    </Row>
                </Col>
                {/*</Col>*/}
            </Row>,
            <Row>
                <Box label="." padding="10px 30px">
                    <Text><h4>
                        {props.info.last_message == null || props.info.last_message === "" ?
                            "Không có tin nhắn nào được gửi đi trong lần trả lời gần nhất"
                            :
                            `Lời nhắn mới nhất: ${props.info.last_message}`
                        }
                    </h4></Text>
                </Box>
            </Row>
        ]
    )
};

class TradeDetail extends React.Component {
    constructor(props) {
        super(props);

        this.renderActionContainer = this.renderActionContainer.bind(this);
    }

    fetchTradeInfo() {
        let url = `https://thedung.pythonanywhere.com/api/transaction/${this.props.id}`;

        const token = localStorage.getItem("token");

        fetch(
            url,
            {
                method: "GET",
                headers: {
                    "Authorization" : `Token ${token}`
                }
            }
        )
            .then((response) => response.json())
            .then((json => {
                console.log(json);
                this.setState({
                    bundle: json
                });
            }))
    }

    componentDidMount() {
        this.fetchTradeInfo();
    }

    renderActionContainer() {
        const trade = this.state.bundle;
        if (trade.owner_email === localStorage.getItem('uid')) {
            switch (trade.status) {
                case 3:
                    return (
                        <Owner3/>
                    );
                case 5:
                    break;
                case 15:
                    break;
                case 6:
                    break;
                case 8:
                    break;
                case 11:
                    break;
                case 12:
                    break;
                case 14:
                    break;
                case 9:
                    break;
                case 10:
                    break;
            }
        } else {

        }
    }

    render() {
        return(
            <Container>
                <h1>ruben chi tiet giao dich</h1>
                {this.state && this.state.bundle &&
                <TradeInfo
                    info={this.state.bundle}
                />
                }
                {this.state && this.state.bundle &&
                this.renderActionContainer()
                }
            </Container>
        )
    }
}

export default TradeDetail;

const CitySelect = (props) => {

    const cities = props.locationBundle.cities;

    let rend = [];
    cities.forEach(
        (city) => {
            rend.push(
                <option key={city.code} value={city.code}>{city.name}</option>
            )
        }
    );

    return (
        <FormGroup row>
            <Label md={3}>ruben city</Label>
            <Col md={9}>
                <Input bsSize="sm" type="select" disabled={props.value !== "1"} onChange={props.cityChange}>
                    {rend}
                </Input>
            </Col>
        </FormGroup>
    )
}

const DistrictSelect = (props) => {

    const districts = props.districtBundle;

    let rend = [];
    districts.forEach(
        (district) => {
            rend.push(
                <option key={district.code} value={district.code}>{district.name}</option>
            )
        }
    );

    return (
        <FormGroup row>
            <Label md={3}>ruben city</Label>
            <Col md={9}>
                <Input bsSize="sm" type="select" disabled={props.value !== "1"} onChange={props.districtChange}>
                    {rend}
                </Input>
            </Col>
        </FormGroup>
    )
}

const WardSelect = (props) => {

    const wards = props.wardBundle;

    let rend = [];
    wards.forEach(
        (ward) => {
            rend.push(
                <option key={ward.code} value={ward.code}>{ward.name}</option>
            )
        }
    );

    return (
        <FormGroup row>
            <Label md={3}>ruben city</Label>
            <Col md={9}>
                <Input bsSize="sm" type="select" disabled={props.value !== "1"} onChange={props.wardChange}>
                    {rend}
                </Input>
            </Col>
        </FormGroup>
    )
}

class CustomLocationModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // custom modal
            value: "1",
            locationBundle: null,
            detail: "",
            finalAddress: "",
        }

        // on change radio for custom location
        this.onChange = (e) => {
            this.setState({
                value: e.target.value
            })
        };

        // map init
        this.getGoogleMaps = () => {
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
        this.initMap = () => {
            const coords = { lat: 41.375885, lng: 2.177813 };
            // debugger
            // const coords = { lat: this.props.instance.book.location.lat, lng: this.props.instance.book.location.lng };
            // create map instance
            // new window.google.maps.Map(document.getElementById('mapContainer'), {
            var map = new window.google.maps.Map(this.refs.mapContainer, {
                zoom: 16,
                center: {
                    lat: coords.lat,
                    lng: coords.lng
                }
            });
            // var marker = new window.google.maps.Marker({position: coords, map: map});
        };


        // api to get location codes
        this.getLocationCodes = () => {
            fetch(
                `https://thedung.pythonanywhere.com/api/location/data`,
                {
                    method: "GET",
                    headers: {
                        "Authorization" : `Token ${localStorage.getItem('token')}`
                    }
                }
            )
                .then(
                    (response) => {
                        return response.json()
                    }
                )
                .then(
                    (
                        json => {
                            this.setState({
                                locationBundle: json,

                                cityBundle: json.cities,
                                city: json.cities[0].code,
                                cityName: "Ho Chi Minh",

                                districtBundle: json.cities[0].districts,
                                district: json.cities[0].districts[0].code,
                                districtName: json.cities[0].districts[0].name,

                                wardBundle: json.cities[0].districts[0].wards,
                                ward: json.cities[0].districts[0].wards[0].code,
                                wardName: json.cities[0].districts[0].wards[0].name
                            });
                        }
                    )
                );
        }

        // select city change
        this.cityChange = (e) => {
            e.preventDefault();
        };

        // select district change
        this.districtChange = (e) => {
            this.setState({
                district: e.target.value
            });

            const districtBundle = this.state.districtBundle;
            districtBundle.forEach(
                (district) => {
                    if (district.code === e.target.value) {
                        this.setState({
                            wardBundle: district.wards
                        });

                        this.setState({
                            districtName: district.name
                        })
                    }
                }
            )
        }

        // select ward change
        this.wardChange = (e) => {
            this.setState({
                ward: e.target.value
            });

            const wardBundle = this.state.wardBundle;
            wardBundle.forEach(
                (ward) => {
                    if (ward.code === e.target.value) {
                        this.setState({
                            wardName: ward.name
                        })
                    }
                }
            )
        }

        // street nr blah blah change
        this.detailChange = (e) => {
            console.log("detail: " + e.target.value);
            this.setState({
                detail: e.target.value
            })
        };

        // submit custom location
        this.submitLocation = () => {
            // Geocode.setApiKey("AIzaSyAQDOsz5Zdwks9zGw9lfDfW4LiNaP_tIV0");
            switch (this.state.value) {
                case "1":
                    var self = this;
                    Geocode.fromAddress(`${this.state.detail}, ${this.state.wardName}, ${this.state.districtName}, ${this.state.cityName}`)
                        .then(
                            response => {
                                const { lat, lng } = response.results[0].geometry.location;
                                console.log(lat, lng);

                                self.setState({
                                    important: {
                                        location_code: `VN${this.state.city}${this.state.district}${this.state.ward}`,
                                        detail: `${this.state.detail}`,
                                        type: 2,
                                        lat: lat,
                                        lng: lng
                                    },
                                    address:`${this.state.detail}, ${this.state.wardName}, ${this.state.districtName}, ${this.state.cityName}`
                                })
                            },
                            error => {
                                alert(error);
                                console.error(error);
                            }
                        );
                    break;
                case "2":
                    break;
                case "3":
                    break;
                default:
                    break;
            }
        }
    }

    componentDidMount(){
        this.getLocationCodes();
        this.getGoogleMaps();
    }

    render() {
        return (
            <Sidebar visible={this.props.isOpen} position="bottom" style={{height: "660px"}} onHide={this.props.onHide}>
                <Container>
                    <Row>
                        <Col md={4}>
                            {/*THU CONG*/}
                            <div className="radio h5">
                                <label>
                                    <input type="radio" value="1" onChange={this.onChange} checked={this.state.value === "1"}/>
                                    ruben
                                </label>
                            </div>

                            {/*AFTER GET API DATA*/}
                            {this.state && this.state.locationBundle &&
                            <div>
                                <CitySelect
                                    locationBundle={this.state.locationBundle}
                                    cityChange={this.cityChange}
                                    value={this.state.value}
                                />

                                <DistrictSelect
                                    districtBundle={this.state.districtBundle}
                                    districtChange={this.districtChange}
                                    value={this.state.value}
                                />

                                <WardSelect
                                    wardBundle={this.state.wardBundle}
                                    wardChange={this.wardChange}
                                    value={this.state.value}
                                />

                                <FormGroup>
                                    <Label>ruben road number</Label>
                                    <Input type="text" placeholder="" disabled={this.state.value !== "1"} onChange={this.detailChange}/>
                                </FormGroup>
                            </div>
                            }


                            {/*VI TRI HIEN TAI*/}
                            <div className="radio h5">
                                <label>
                                    <input type="radio" value="2" onChange={this.onChange} checked={this.state.value === "2"}/>
                                    ruben
                                </label>
                            </div>

                            <FormGroup>
                                <Input bsSize="sm" type="text" name="email" id="exampleEmail" placeholder="" disabled={this.state.value !== "2"}/>
                            </FormGroup>


                            {/*CHON TREN BAN DO*/}
                            <div className="radio h5">
                                <label>
                                    <input type="radio" value="3" onChange={this.onChange} checked={this.state.value === "3"}/>
                                    ruben
                                </label>
                            </div>

                            <FormGroup>
                                <Input bsSize="sm" type="text" name="email" id="exampleEmail" placeholder="" disabled={this.state.value !== "3"}/>
                            </FormGroup>
                        </Col>

                        {/*BAN DO*/}
                        <Col md={8}>
                            <div ref="mapContainer" style={{width: "100%", height: "100%"}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Button onClick={this.submitLocation}>ruben gui</Button>
                    </Row>
                </Container>
            </Sidebar>
        )
    }
}

class Owner3 extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // main
            dropdownOpen: false,
            message: "",
            location: null,



            //popup
            isModalOpen: false,
        };





        // inside
        this.messageChange = (e) => {
            console.log('message ' + e.target.value);
            this.setState({
                message: e.target.value
            })
        }

        this.locationPicked = (option) => {
            switch (option) {
                case 1:
                    fetch(
                        `https://thedung.pythonanywhere.com/api/location/user/${localStorage.getItem('uid')}/1`,
                        {
                            method: "GET",
                            headers: {
                                "Authorization" : `Token ${localStorage.getItem('token')}`
                            }
                        }
                    )
                        .then(response => response.json())
                        .then(
                            json => {
                                console.log(json);
                                this.setState({
                                    important: json,
                                    address: json.detail + ', ' + json.ward + ', ' + json.district + ', ' + json.city
                                });
                            }
                        );
                    break;
                case 2:
                    this.showPopup();
                    break;
                case 3:
                    fetch(
                        `https://thedung.pythonanywhere.com/api/location/user/${localStorage.getItem('uid')}/3`,
                        {
                            method: "GET",
                            headers: {
                                "Authorization" : `Token ${localStorage.getItem('token')}`
                            }
                        }
                    )
                        .then(response => response.json())
                        .then(
                            json => {
                                if (typeof(json.error_code) === "undefined") {
                                    console.log(json);
                                    this.setState({
                                        important: json,
                                        address: json.detail + ', ' + json.ward + ', ' + json.district + ', ' + json.city
                                    })
                                } else {
                                    alert('ruben');
                                    //TODO: ruben chua cap nhat dia chi mac dinh
                                }
                            }
                        )
                    break;
            }
        }

        this.acceptRequest = () => {

        }

        this.declineRequest = () => {

        }


        this.toggle = () => {
            this.setState(prevState => ({
                dropdownOpen: !prevState.dropdownOpen
            }));
        }

        this.showPopup = () => {
            this.setState({
                isModalOpen: true
            })
        }
        this.hidePopup = () => {
            this.setState({
                isModalOpen: false
            })
        }
        // this.toggleModal = () => {
        //     this.setState({
        //         isModalOpen: !this.state.isModalOpen
        //     });
        // }
    }

    componentDidMount(){
        // this.getLocationCodes();
    }

    render() {
        return(
            <Container>
                <Row>
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle>
                            ruben_bancanthemdiachi
                        </DropdownToggle>
                        <DropdownMenu>

                            <DropdownItem onClick={() => this.locationPicked(1)}>
                                ruben1
                            </DropdownItem>

                            <DropdownItem onClick={() => this.locationPicked(3)}>
                                ruben3
                            </DropdownItem>

                            <DropdownItem onClick={() => this.locationPicked(2)}>
                                ruben2
                            </DropdownItem>

                        </DropdownMenu>
                    </Dropdown>
                </Row>
                <Row>
                    {this.state.address === null ?
                        <h3>not_ruben dia chi chon:</h3>
                        :
                        <h3>{this.state.address}</h3>
                    }
                </Row>
                <Row>
                    <FormGroup>
                        {/*<Label for="exampleText">{ruben.review_about_this}</Label>*/}
                        <Input type="textarea" name="text" id="review" placeholder="ruben" onChange={this.messageChange}/>
                    </FormGroup>
                </Row>
                <Row>
                    <Button onClick={this.acceptRequest}>ruben1</Button>
                    <Button onClick={this.declineRequest}>ruben1</Button>
                </Row>
                <Row>
                    <CustomLocationModal
                        isOpen = {this.state.isModalOpen}
                        onHide = {this.hidePopup}
                    />
                </Row>
            </Container>
        )
    }
}

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

function convertTime(raw) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    // parseFloat(raw);
    var date = new Date(raw*1000);

    //TODO: sua ngay
    // date.setDate(date.getDate());
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