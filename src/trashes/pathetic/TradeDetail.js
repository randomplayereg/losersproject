import React from 'react';

import { Box, Text } from 'react-desktop/macOs';

import Geocode from "../cripple/Geocode";

import {Sidebar} from 'primereact/sidebar';

import marker from '../retards/location_picker.png';

import {geolocated} from 'react-geolocated';
import {
    Button, ButtonDropdown,
    Col,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    FormGroup,
    Input, Label, Media, Modal, ModalBody, ModalFooter, ModalHeader,
    Row
} from "reactstrap";

import {ruben} from "../../Ruben";

import '../leftovers/trade.css';

var map;
var directionsService;
var directionsDisplay;
var mMarker;
var loc;


const MessageBox = (props) => (
    <FormGroup style={{width: "100%"}}>
        <Input type="textarea" name="text" id="review" placeholder={ruben.write_a_message} onChange={props.messageChange}/>
    </FormGroup>
)

function locationToString(location) {
    return `${location.detail}, ${location.ward}, ${location.district}, ${location.city}, ${location.country}`;
}

//TODO: ONGOING
const OnGoingInfo = (props) => {
    const getAddress = props.tradeBundle.location;
    const returnAddress = props.tradeBundle.location_return;
    const startDate = props.tradeBundle.time_start_exchange;
    const endDate = props.tradeBundle.time_expire_exchange;
    return (
        // on going height
        <Col md={12} className="on-going mb-3">
            {getAddress !== null &&
                <Row>
                    <p><strong>{ruben.get_address}:</strong> {locationToString(getAddress)}</p>
                </Row>
            }
            {returnAddress !== null &&
            <Row>
                <p><strong>{ruben.return_address}:</strong> {locationToString(returnAddress)}</p>
            </Row>
            }
            {startDate !== null &&
            <Row>
                <p><strong>{ruben.start_date}:</strong> {convertTime(startDate)}</p>
            </Row>
            }
            {endDate !== null &&
            <Row>
                <p><strong>{ruben.end_date}:</strong> {convertTime(endDate)}</p>
            </Row>
            }
        </Col>
    )
};

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

const TradeInfo = (props) => {

    // TODO: check dang nhap
    const currentEmail = localStorage.getItem('uid');

    return (
        [
            <Row className="trade-title mb-3">
                <h2 style={{margin: 'auto'}}>Chi tiết giao dịch</h2>
            </Row>,
            <Row className={"trade-info"}>
                {/*<Col md={12} style={styles.infoContainer}>*/}
                <Col md={5} style={{margin: 'auto'}}>
                    <div style={{display: 'flex'}}>
                        <img src={props.info.book_image} thumbnail style={{margin: 'auto'}}/>
                    </div>
                </Col>
                <Col md={7}>
                    <Row>
                        <p><strong>{props.info.book_name}</strong></p>
                    </Row>

                    <Row>
                        <p>Chủ sở hữu: {props.info.owner_name}</p>
                    </Row>

                    <Row>
                        <p>Người mượn: {props.info.requester_name}</p>
                    </Row>

                    <Row>
                        <p>Trạng thái sách: {statusToString(props.info.status)}</p>
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

        // REFRESH FUNCTION AT PARENT
        this.refresh = () => {
            this.forceUpdate();
        };

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
                        <Owner3
                            tradeBundle={trade}
                            // PASS REFRESH FUNC DOWN
                            refresh={this.refresh}
                        />
                    );
                case 4:
                    return (
                        <Owner4
                            tradeBundle={trade}
                            // PASS REFRESH FUNC DOWN
                            refresh={this.refresh}
                        />
                    );
                case 5:
                    break;
                case 15:
                    return (
                        // PASS ALL INFO OF TRADE DOWN
                        <Owner15
                            tradeBundle={trade}
                        />
                    );
                    break;
                case 6:
                    return (
                        // PASS ALL INFO OF TRADE DOWN
                        <Owner6
                            tradeBundle={trade}
                        />
                    );
                    break;
                case 8:
                    return (
                        // PASS ALL INFO OF TRADE DOWN
                        <Owner8
                            tradeBundle={trade}
                        />
                    );
                    break;
                case 11:
                    return (
                        <Owner11
                            tradeBundle={trade}
                            // PASS REFRESH FUNC DOWN
                            refresh={this.refresh}
                        />
                    );
                case 12:
                    return (
                        <Owner12
                            tradeBundle={trade}
                            // PASS REFRESH FUNC DOWN
                            refresh={this.refresh}
                        />
                    );
                    break;
                case 14:
                    return (
                        <Fourteen
                            tradeBundle={trade}
                        />
                    );
                    break;
                case 9:
                    break;
                case 10:
                    break;
                case 16:
                    return (
                        <Owner16
                            tradeBundle={trade}
                            />
                    )
            }
        } else {
            switch (trade.status) {
                case 3:
                    return (
                        <Requester3
                            tradeBundle={trade}
                            // PASS REFRESH FUNC DOWN
                            refresh={this.refresh}
                        />
                    );
                case 4:
                    return (
                        <Requester4
                            tradeBundle={trade}
                        />
                    )
                case 5:
                    break;
                case 15:
                    return (
                        // PASS ALL INFO OF TRADE DOWN
                        <Requester15
                            tradeBundle={trade}
                        />
                    );
                    break;
                case 6:
                    return (
                        // PASS ALL INFO OF TRADE DOWN
                        <Requester6
                            tradeBundle={trade}
                        />
                    );
                    break;
                case 8:
                    return (
                        // PASS ALL INFO OF TRADE DOWN
                        <Requester8
                            tradeBundle={trade}
                        />
                    );
                    break;
                case 11:
                    return (
                        <Requester11
                            tradeBundle={trade}
                            // PASS REFRESH FUNC DOWN
                            refresh={this.refresh}
                        />
                    );
                case 12:
                    return (
                        <Requester12
                            tradeBundle={trade}
                            // PASS REFRESH FUNC DOWN
                            refresh={this.refresh}
                        />
                    );
                    break;
                case 14:
                    return (
                        <Fourteen
                            tradeBundle={trade}
                        />
                    );
                case 9:
                    break;
                case 10:
                    break;
                case 16:
                    return (
                        <Requester16
                            tradeBundle={trade}
                        />
                    )
            }
        }
    }

    render() {
        return(
            <Container>
                {this.state && this.state.bundle &&
                <TradeInfo
                    info={this.state.bundle}
                />
                }
                {this.state && this.state.bundle &&
                this.renderActionContainer()
                }
                <Row className="trade-title mb-3 mt-3">
                </Row>
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
            <Label md={3}>{ruben.city}</Label>
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
            <Label md={3}>{ruben.district}</Label>
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
            <Label md={3}>{ruben.ward}</Label>
            <Col md={9}>
                <Input bsSize="sm" type="select" disabled={props.value !== "1"} onChange={props.wardChange}>
                    {rend}
                </Input>
            </Col>
        </FormGroup>
    )
}

// CUSTOM PICKER FOR CUSTOM LOCATION
class CustomLocationModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // custom modal
            value: "1",
            locationBundle: null,
            detail: "",
            finalAddress: "",
        };


        this.getMyLocation = this.getMyLocation.bind(this)

        // on change radio for custom location
        this.onChange = (e) => {
            this.setState({
                value: e.target.value
            });
            switch (e.target.value) {
                case "1":
                    break;
                case "2":
                    this.getMyLocation();
                    //TODO: LAST ACTION: move convertLATLNG to callback
                    break;
                case "3":
                    break;
            }
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
            const coords = { lat: 10.762622, lng: 106.660172 };
            // debugger
            // const coords = { lat: this.props.instance.book.location.lat, lng: this.props.instance.book.location.lng };
            // create map instance
            // new window.google.maps.Map(document.getElementById('mapContainer'), {
            map = new window.google.maps.Map(this.refs.mapContainer, {
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

        // set (important,address) from (lat,lng) from CURRENT LOCATION or PICK ON MAP
        this.convertLatLng = (lat, lng) => {
            Geocode.setApiKey("AIzaSyAQDOsz5Zdwks9zGw9lfDfW4LiNaP_tIV0");

            var self = this;

            Geocode.fromLatLng(`${lat}`, `${lng}`)
                .then(
                    response => {
                        const address = response.results[0].formatted_address;
                        const locationData = this.state.locationBundle;
                        //TODO: deprive location data from API
                        // debugger

                        var parts = address.split(', ');
                        if (parts.length == 5) {
                            let locationCode = "";

                            var country = parts[4];
                            var city = parts[3];
                            var district = parts[2];
                            var ward = parts[1];
                            var detail = parts[0];

                            if (country === 'Việt Nam' || country === 'Vietnam') {
                                locationCode += "VN";
                                if (city === "Hồ Chí Minh") {
                                    locationCode += "01";

                                    const districts = locationData.cities[0].districts;

                                    const d = districts.find(
                                        (item) => {
                                            return item.name === district
                                        }
                                    );

                                    if (d) {
                                        locationCode += d.code;
                                        const dd = d.wards.find(
                                            (item) => {
                                                return item.name === ward
                                            }
                                        )
                                        if (dd) {
                                            locationCode += dd.code;
                                            self.setState({
                                                important: {
                                                    code: locationCode,
                                                    detail: detail,
                                                    type: 2,
                                                    lat: lat,
                                                    lng: lng
                                                },
                                                // TODO: address questrionmark
                                                // address: {
                                                //     important: {
                                                //         location_code: locationCode,
                                                //         detail: detail,
                                                //         type: 2,
                                                //         lat: lat,
                                                //         lng: lng
                                                //     },
                                                //     toString: `${address}`
                                                // }
                                            });
                                        } else {
                                            alert('Chúng tôi hiện chưa hỗ trợ địa điểm này! Mong bạn thông cảm!');
                                            return;
                                        }
                                    } else {
                                        alert('Chúng tôi hiện chưa hỗ trợ địa điểm này! Mong bạn thông cảm!');
                                        return;
                                    }

                                } else {
                                    alert('Chúng tôi hiện chưa hỗ trợ địa điểm này! Mong bạn thông cảm!');
                                    return;
                                }
                            }
                        } else {
                            alert('Chúng tôi hiện chưa hỗ trợ địa điểm này! Mong bạn thông cảm!');
                            return;
                        }

                        self.setState({
                            address: address
                        });
                        console.log(address);
                    },
                    error => {
                        alert(error);
                        console.error(error);
                    }
                );
        }

        // submit custom location
        this.submitLocation = () => {
            // Geocode.setApiKey("AIzaSyAQDOsz5Zdwks9zGw9lfDfW4LiNaP_tIV0");
            switch (this.state.value) {
                case "1":
                    // TODO: LAST ACTION: move handle location-pick-1 from "press Submit" to "change radio button" => MAYBE NOT
                    var self = this;
                    Geocode.fromAddress(`${this.state.detail}, ${this.state.wardName}, ${this.state.districtName}, ${this.state.cityName}`)
                        .then(
                            response => {
                                const { lat, lng } = response.results[0].geometry.location;
                                console.log(lat, lng);

                                const imp = {
                                    code: `VN${this.state.city}${this.state.district}${this.state.ward}`,
                                    detail: `${this.state.detail}`,
                                    type: 2,
                                    lat: lat,
                                    lng: lng
                                };
                                const add = `${this.state.detail}, ${this.state.wardName}, ${this.state.districtName}, ${this.state.cityName}`;

                                self.setState({
                                    important: {
                                        code: `VN${this.state.city}${this.state.district}${this.state.ward}`,
                                        detail: `${this.state.detail}`,
                                        type: 2,
                                        lat: lat,
                                        lng: lng
                                    },
                                    address:`${this.state.detail}, ${this.state.wardName}, ${this.state.districtName}, ${this.state.cityName}`
                                })

                                this.props.onHide();
                                this.props.sneaky(imp, add);
                            },
                            error => {
                                alert(error);
                                console.error(error);
                            }
                        );
                    break;
                case "2":
                    //TODO CHECK IF "NULL" important
                    this.props.onHide();
                    this.props.sneaky(this.state.important, this.state.address);
                    // TODO: handle if no geolocated support
                    // TODO: move submit CURRENT to change-radio CURRENT
                    break;
                case "3":
                    this.props.onHide();
                    this.props.sneaky(this.state.important, this.state.address);
                    break;
                default:
                    break;
            }
        }

        //confirm pick on map
        this.confirmPickOnMap = () => {
            var c = map.getCenter();
            this.convertLatLng(c.lat(), c.lng());
            // console.log(c.lat() + ' ' + c.lng());
        }

        //watch on map
        this.watchOnMap = () => {


            var self = this;
            if (this.state.value === "1") {
                Geocode.fromAddress(`${this.state.detail}, ${this.state.wardName}, ${this.state.districtName}, ${this.state.cityName}`)
                    .then(
                        response => {
                            const { lat, lng } = response.results[0].geometry.location;
                            console.log(lat, lng);
                            self.setState({
                                important: {
                                    code: `VN${this.state.city}${this.state.district}${this.state.ward}`,
                                    detail: `${this.state.detail}`,
                                    type: 2,
                                    lat: lat,
                                    lng: lng
                                },
                                address:`${this.state.detail}, ${this.state.wardName}, ${this.state.districtName}, ${this.state.cityName}`
                            });
                            //
                            loc = {
                                lat: lat,
                                lng: lng
                            }
                            //
                        },
                        error => {
                            alert(error);
                            console.error(error);
                        }
                    );

            } else {
                console.log(this.state.important);
                if (typeof(this.state.important) === "undefined") {
                    alert("Bạn chưa chọn vị trí");
                    return;
                }

                //
                loc = {
                    lat: this.state.important.lat,
                    lng: this.state.important.lng
                }
                //
            }

            if (typeof(mMarker) !== "undefined") {
                mMarker.setMap(null);
            };
            mMarker = new window.google.maps.Marker({
                position: loc,
                map: map
            });
            map.panTo(loc);
            mMarker.setMap(map);
        }
    }

    //TODO: use https://stackoverflow.com/questions/46387375/reactjs-get-latitude-on-click-and-show-it-in-input
    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation

        if (location) {
            location.getCurrentPosition((position) => {
                console.log('callback');
                console.log(position);

                this.convertLatLng(position.coords.latitude, position.coords.longitude);

            }, (error) => {
                alert('Some thing wrong, check console for more info');
                console.log(error);
            })
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
                                    {ruben.add_by_type}
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
                                    <Label>{ruben.street}</Label>
                                    <Input type="text" placeholder="" disabled={this.state.value !== "1"} onChange={this.detailChange}/>
                                </FormGroup>
                            </div>
                            }


                            {/*VI TRI HIEN TAI*/}
                            <div className="radio h5">
                                <label>
                                    <input type="radio" value="2" onChange={this.onChange} checked={this.state.value === "2"}/>
                                    {ruben.add_current}
                                </label>
                            </div>

                            <h6>{this.state.value === "2" ? this.state.address : ""}</h6>

                            {/*TODO: LAST ACTION chagne input to p to show address*/}
                            {/*<FormGroup>*/}
                                {/*<Input bsSize="sm" type="text" name="email" id="exampleEmail" placeholder=""*/}
                                       {/*// disabled={this.state.value !== "2"}*/}
                                       {/*disabled={true}*/}
                                       {/*value={this.state.value === "2" ? this.state.address : ""}*/}
                                {/*/>*/}
                            {/*</FormGroup>*/}


                            {/*CHON TREN BAN DO*/}
                            <div className="radio h5">
                                <label>
                                    <input type="radio" value="3" onChange={this.onChange} checked={this.state.value === "3"}/>
                                    {ruben.add_from_map}
                                </label>
                            </div>

                            <h6>{this.state.value === "3" ? this.state.address : ""}</h6>

                            {/*TODO: LAST ACTION chagne input to p to show address*/}
                        </Col>

                        {/*BAN DO*/}
                        <Col md={8}>
                            <div style={{width: "100%", height: "100%", position: "relative"}}>
                                <div ref="mapContainer"
                                     style={{width: "100%", height: "100%", position: "relative"}}
                                />
                                <div style={{position: "absolute", top: '42%', left: '47%'}}>
                                    {/*<image src={require('../retards/location_picker.png')} width='40px' height='40px'/>*/}
                                    {/*TODO: reminder <IMG> NOT <IMAGE>*/}
                                    <img hidden={this.state.value!=="3"} src={require('../retards/location_picker.png')} width={'40px'} height={'40px'}/>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <u onClick={this.watchOnMap}>{ruben.watch_map}</u>
                            <Button className="gui-btn" style={{float: "right"}} onClick={this.submitLocation}>Gửi</Button>
                        </Col>
                        <Col md={8}>
                            <Button style={{float: "right"}} onClick={this.confirmPickOnMap} disabled={this.state.value !== "3"}>Ok</Button>
                        </Col>
                    </Row>
                </Container>
            </Sidebar>
        )
    }
}

// OWNER 3 ACTION
class Owner3 extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // main
            dropdownOpen: false,
            message: "",
            parentImportant: null,
            parentAddress: null,

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
                                    parentImportant: json,
                                    parentAddress: json.detail + ', ' + json.ward + ', ' + json.district + ', ' + json.city
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
                                        parentImportant: json,
                                        parentAddress: json.detail + ', ' + json.ward + ', ' + json.district + ', ' + json.city
                                    })
                                } else {
                                    alert(ruben.please_add_location);
                                    //TODO: ruben chua cap nhat dia chi mac dinh
                                }
                            }
                        )
                    break;
            }
        }

        this.accept = () => {
            //TODO: check if no location was provided

            fetch(
                `https://thedung.pythonanywhere.com/api/transaction/response-with-location`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : `Token ${localStorage.getItem('token')}`
                    },
                    body: prepareData(
                        {
                            'id': this.props.tradeBundle.id,
                            'code': 4,
                            'location_code': this.state.parentImportant.code,
                            'detail': this.state.parentImportant.detail,
                            'type': 2,
                            'lat': this.state.parentImportant.lat,
                            'lng': this.state.parentImportant.lng,
                            // TODO:
                            'last_message': this.state.message
                        }
                    )
                }
            )
                .then(
                    (response) => {
                        console.log(response);
                        return response.json()
                    }
                )
                .then(
                    json => {
                        console.log(json);
                        // debugger
                        window.location.reload();
                    }
                )
        }

        this.decline = () => {
            fetch(
                `https://thedung.pythonanywhere.com/api/transaction/reply-request`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : `Token ${localStorage.getItem('token')}`
                    },
                    body: prepareData(
                        {
                            'id': this.props.tradeBundle.id,
                            'code': 1
                        }
                    )
        }
            )
                .then(response => response.json())
                .then(
                    json => {
                        console.log(json);
                        // TODO: check success repsonse
                        if (json.error_code === 0) {
                            window.location.reload();
                        }
                    }
                )
        };


        this.toggle = () => {
            this.setState(prevState => ({
                dropdownOpen: !prevState.dropdownOpen
            }));
        }

        this.showPopup = (e) => {
            this.setState({
                isModalOpen: true
            })
        }
        this.hidePopup = (e) => {
            this.setState({
                isModalOpen: false
            })
        }

        this.sneaky = (important, address) => {
            console.log('get data');
            console.log(important);
            console.log(address);

            this.setState({
                parentImportant: important,
                parentAddress: address
            })
        }

    }

    componentDidMount(){
    }

    render() {
        return(
            <Container>
                <Row className={"mt-3"}>
                    <Col md={1} className={"d-flex justify-content-ccenter"}>
                        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle className={"plus-btn"}>
                                <i className={"fa fa-plus"}></i>
                            </DropdownToggle>
                            <DropdownMenu>

                                <DropdownItem onClick={() => this.locationPicked(1)}>
                                    {ruben.use_profile}
                                </DropdownItem>

                                <DropdownItem onClick={() => this.locationPicked(3)}>
                                    {ruben.use_default}
                                </DropdownItem>

                                <DropdownItem onClick={() => this.locationPicked(2)}>
                                    {ruben.use_input}
                                </DropdownItem>

                            </DropdownMenu>
                        </ButtonDropdown>
                    </Col>
                    <Col md={10} className="d-flex align-items-center">
                        <span className="plus-span ">
                            {this.state.parentAddress === null ?
                                ruben.explain_add_locatioin
                                :
                                this.state.parentAddress
                            }
                        </span>
                    </Col>
                </Row>
                <Row className={"mt-3"}>
                    <MessageBox
                        messageChange={this.messageChange}
                    />
                </Row>

                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn green-btn"} onClick={this.accept} size="lg">{ruben.accept}</Button>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn red-btn"} onClick={this.decline} size="lg">{ruben.decline}</Button>
                </Row>
                <Row>
                    <CustomLocationModal
                        isOpen = {this.state.isModalOpen}
                        onHide = {this.hidePopup}
                        sneaky = {this.sneaky}
                    />
                </Row>
            </Container>
        )
    }
}

class Owner4 extends  React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
    }

    render() {
        return(
            <Container>
                <Row className={"mt-3"}>

                </Row>
                <Row className={"mt-3"}>
                    <OnGoingInfo
                        tradeBundle={this.props.tradeBundle}
                    />
                </Row>
            </Container>
        )
    }
}

// OWNER 15 ACTIOn
class Owner15 extends  React.Component {
    constructor(props){
        super(props);

        this.changeBookStatus = () => {
            fetch(
                `https://thedung.pythonanywhere.com/api/transaction/change-status/owner`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : `Token ${localStorage.getItem('token')}`
                    },
                    body: prepareData(
                        {
                            'id': this.props.tradeBundle.id,
                            'code': 6,
                            // 'last_message': this.state.message
                            //TODO: message for book ready/not ready
                        }
                    )
                }
            )
                .then(
                    (response) => {
                        console.log(response);


                        return response.json()
                    }
                )
                .then(
                    (
                        json => {
                            console.log(json);

                            // // TODO: check success repsonse
                            // if (true) {
                            //     window.location.reload();
                            // }
                        }
                    )
                )
        }
    }

    render() {
        return(
            <Container>

                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn green-btn"} onClick={this.changeBookStatus} size="lg">{ruben.change_book_ready}</Button>
                </Row>

            </Container>
        )
    }
}

// OWNER 6 ACTION
class Owner6 extends  React.Component {
    constructor(props){
        super(props);

        this.changeBookStatus = () => {
            fetch(
                `https://thedung.pythonanywhere.com/api/transaction/change-status/owner`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : `Token ${localStorage.getItem('token')}`
                    },
                    body: prepareData(
                        {
                            'id': this.props.tradeBundle.id,
                            'code': 15,
                            //TODO:
                            // 'last_message': this.state.message
                            //TODO: message for book ready/not ready
                        }
                    )
                }
            )
                .then(
                    (response) => {
                        console.log(response);
                        return response.json()
                    }
                )
                .then(
                    (
                        json => {
                            console.log(json);
                            // window.location.reload();

                            // // TODO: check success repsonse
                            // if (true) {
                            //     window.location.reload();
                            // }
                        }
                    )
                )
        }
    }

    render() {
        return(
            <Container>

                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn red-btn"} onClick={this.changeBookStatus} size="lg">{ruben.change_book_not_ready}</Button>
                </Row>

            </Container>
        )
    }
}


// OWNER 8
class Owner8 extends  React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <Container>

                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />
            </Container>
        )
    }
}

// OWNER 11 ACTION
class Owner11 extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // main
            dropdownOpen: false,
            message: "",
            parentImportant: null,
            parentAddress: null,

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
                                    parentImportant: json,
                                    parentAddress: json.detail + ', ' + json.ward + ', ' + json.district + ', ' + json.city
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
                                        parentImportant: json,
                                        parentAddress: json.detail + ', ' + json.ward + ', ' + json.district + ', ' + json.city
                                    })
                                } else {
                                    alert(ruben.please_add_location);
                                    //TODO: ruben chua cap nhat dia chi mac dinh
                                }
                            }
                        )
                    break;
            }
        }

        this.accept = () => {
            //TODO: check if no location was provided

            fetch(
                `https://thedung.pythonanywhere.com/api/transaction/response-with-location`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : `Token ${localStorage.getItem('token')}`
                    },
                    body: prepareData(
                        {
                            'id': this.props.tradeBundle.id,
                            'code': 12,
                            'location_code': this.state.parentImportant.code,
                            'detail': this.state.parentImportant.detail,
                            'type': 2,
                            'lat': this.state.parentImportant.lat,
                            'lng': this.state.parentImportant.lng,
                            // TODO:
                            'last_message': this.state.message
                        }
                    )
                }
            )
                .then(
                    (response) => {
                        console.log(response);
                        return response.json()
                    }
                )
                .then(
                    json => {
                        console.log(json);
                        // debugger
                        window.location.reload();
                    }
                )
        }

        this.decline = () => {
            let url = `https://thedung.pythonanywhere.com/api/transaction/change-status/owner`;

            const body = prepareData(
                {
                    'id': this.props.tradeBundle.id,
                    'code': 8,
                    //TODO:
                    'last_message': this.state.message
                }
            );

            const token = `Token ${localStorage.getItem('token')}`;

            fetch(
                url,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : token
                    },
                    body: body
                }
            )
                .then(
                    (response) => {
                        console.log(response);

                        // TODO: check success repsonse
                        if (true) {
                            window.location.reload();
                        }

                        return response.json()
                    }
                )
                .then(
                    (
                        json => {
                            console.log(json);
                        }
                    )
                )
        };


        this.toggle = () => {
            this.setState(prevState => ({
                dropdownOpen: !prevState.dropdownOpen
            }));
        }

        this.showPopup = (e) => {
            this.setState({
                isModalOpen: true
            })
        }
        this.hidePopup = (e) => {
            this.setState({
                isModalOpen: false
            })
        }

        this.sneaky = (important, address) => {
            console.log('get data');
            console.log(important);
            console.log(address);

            this.setState({
                parentImportant: important,
                parentAddress: address
            })
        }

    }

    componentDidMount(){
    }

    render() {
        return(
            <Container>
                <Row className={"mt-3"}>
                    <Col md={1} className={"d-flex justify-content-ccenter"}>
                        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle className={"plus-btn"}>
                                <i className={"fa fa-plus"}></i>
                            </DropdownToggle>
                            <DropdownMenu>

                                <DropdownItem onClick={() => this.locationPicked(1)}>
                                    {ruben.use_profile}
                                </DropdownItem>

                                <DropdownItem onClick={() => this.locationPicked(3)}>
                                    {ruben.use_default}
                                </DropdownItem>

                                <DropdownItem onClick={() => this.locationPicked(2)}>
                                    {ruben.use_input}
                                </DropdownItem>

                            </DropdownMenu>
                        </ButtonDropdown>
                    </Col>
                    <Col md={10} className="d-flex align-items-center">
                        <span className="plus-span ">
                            {this.state.parentAddress === null ?
                                ruben.explain_add_locatioin
                                :
                                this.state.parentAddress
                            }
                        </span>
                    </Col>
                </Row>
                <Row className={"mt-3"}>
                    <MessageBox
                        messageChange={this.messageChange}
                    />
                </Row>

                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn green-btn"} onClick={this.accept} size="lg">{ruben.accept}</Button>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn red-btn"} onClick={this.decline} size="lg">{ruben.decline}</Button>
                </Row>
                <Row>
                    <CustomLocationModal
                        isOpen = {this.state.isModalOpen}
                        onHide = {this.hidePopup}
                        sneaky = {this.sneaky}
                    />
                </Row>
            </Container>
        )
    }
}

// OWNER 12
class Owner12 extends  React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <Container>

                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />
            </Container>
        )
    }
}

// OWNER 16
class Owner16 extends  React.Component {
    constructor(props){
        super(props);

        this.changeBookStatus = () => {
            let url = `https://thedung.pythonanywhere.com/api/transaction/change-status/owner`;

            const body = prepareData(
                {
                    'id': this.props.tradeBundle.id,
                    'code': 14,
                    //TODO:
                    // 'last_message': this.state.message
                }
            );

            const token = `Token ${localStorage.getItem('token')}`;

            fetch(
                url,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : token
                    },
                    body: body
                }
            )
                .then(
                    (response) => {
                        console.log(response);

                        // TODO: check success repsonse
                        if (true) {
                            window.location.reload();
                        }

                        return response.json()
                    }
                )
                .then(
                    (
                        json => {
                            console.log(json);
                        }
                    )
                )
        }
    }

    render() {
        return(
            <Container>
                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn green-btn"} onClick={this.changeBookStatus} size="lg"> {ruben.me_took_book} </Button>
                </Row>
            </Container>
        )
    }
}

class DirectionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: -1
        }

        this.getMyLocation = this.getMyLocation.bind(this);

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

            // SHOW MAP
            directionsService = new window.google.maps.DirectionsService();
            directionsDisplay = new window.google.maps.DirectionsRenderer();

            var origin = new window.google.maps.LatLng(this.props.userLocation.lat, this.props.userLocation.lng);
            var destination = new window.google.maps.LatLng(this.props.tradeLocation.lat, this.props.tradeLocation.lng);
            var mapOptions = {
                zoom: 10,
                center: origin
            }

            map = new window.google.maps.Map(this.refs.mapContainer, mapOptions);
            directionsDisplay.setMap(map);


            // CALL DIRECTION
            var request = {
                origin: origin,
                destination: destination,
                // Note that Javascript allows us to access the constant
                // using square brackets and a string value as its
                // "property."
                travelMode: "DRIVING"
            };
            directionsService.route(request, function(response, status) {
                if (status == 'OK') {
                    directionsDisplay.setDirections(response);
                }
            });
        };
    }

    getMyLocation() {
        const location = window.navigator && window.navigator.geolocation

        if (location) {
            location.getCurrentPosition((position) => {
                console.log('callback');
                console.log(position);

                this.convertLatLng(position.coords.latitude, position.coords.longitude);

            }, (error) => {
                alert('Some thing wrong, check console for more info');
                console.log(error);
            })
        }

    }

    componentDidMount(){
        this.getGoogleMaps();
    }

    render() {
        return(
            <Sidebar visible={this.props.isOpen} position="bottom" style={{height: "660px"}} onHide={this.props.hide}>
                <Container>
                    {/*<p>{this.props.userLocation.lat}{this.props.userLocation.lng}</p>*/}
                    {/*<p>{this.props.tradeLocation.lat}{this.props.tradeLocation.lng}</p>*/}
                    <Row style={{height: "550px"}}>
                        <div style={{width: "100%", height: "100%", position: "relative"}}>
                            <div ref="mapContainer"
                                 style={{width: "100%", height: "100%", position: "relative"}}
                            />
                            <div style={{position: "absolute", top: '44%', left: '49%'}}>
                                {/*<image src={require('../retards/location_picker.png')} width='40px' height='40px'/>*/}
                                {/*TODO: reminder <IMG> NOT <IMAGE>*/}
                                <img hidden={this.state.value!=="3"} src={require('../retards/location_picker.png')} width={'40px'} height={'40px'}/>
                            </div>
                        </div>
                    </Row>
                </Container>
            </Sidebar>
        )
    }
}

// REQUESTER 3 ACTION
class Requester3 extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            message: ""
        }

        this.messageChange = (e) => {
            console.log(e.target.value);
            this.setState({
                message: e.target.value
            })
        }

        this.cancel =() => {
            let url = `https://thedung.pythonanywhere.com/api/transaction/cancel-request`;

            const body = prepareData(
                {
                    'id': this.props.tradeBundle.id
                }
            );

            const token = `Token ${localStorage.getItem('token')}`

            fetch(
                url,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : token
                    },
                    body: body
                }
            )
                .then(
                    (response) => {
                        console.log(response);
                        return response.json()
                    }
                )
                .then(
                    (
                        json => {

                            // TODO: check success repsonse
                            if (true) {
                                window.location.reload();
                            }
                            console.log(json);
                        }
                    )
                )
        }
    }

    render() {
        return (
            <Container>
                <br/>
                <Row>
                    <MessageBox
                        messageChange={this.messageChange}
                    />
                </Row>

                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn purple-btn"} onClick={this.cancel} size="lg">{ruben.cancel}</Button>
                </Row>

                {this.state && this.state.userLocation &&
                <Row>
                    <DirectionModal
                        userLocation={this.state.userLocation}
                        tradeLocation={this.props.tradeBundle.location}
                        isOpen={this.state.isOpen}
                        show={this.show}
                        hide={this.hide}
                    />
                </Row>
                }
            </Container>
        )
    }
}

// REQUESTER 4 ACTION
class Requester4 extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            message: "",
            isOpen: false
        }

        this.show = (e) => {
            this.setState({
                isOpen: true
            })
        }

        this.hide = (e) => {
            this.setState({
                isOpen: false
            })
        }

        this.messageChange = (e) => {
            console.log(e.target.value);
            this.setState({
                message: e.target.value
            })
        }

        this.fetchUserLocation = () => {
            const currentEmail = localStorage.getItem('uid');
            const token = `Token ${localStorage.getItem('token')}`;

            let url = `https://thedung.pythonanywhere.com/api/location/user/${currentEmail}/3`;
            fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Authorization" : token
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
                            console.log(json);
                            this.setState({
                                userLocation: json
                            });
                        }
                    )
                )
        };
        this.fetchUserLocation();

        this.accept = () => {
            const currentEmail = localStorage.getItem('uid');

            if ((typeof(currentEmail) === "undefined") || (currentEmail === "")) {
                alert('No login');
            };

            const token = `Token ${localStorage.getItem('token')}`;

            const body = prepareData(
                {
                    'id': this.props.tradeBundle.id,
                    'code': 15,
                    'last_message': this.state.message
                }
            );

            let url = `https://thedung.pythonanywhere.com/api/transaction/change-status/requester`;
            fetch(
                url,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : token
                    },
                    body: body
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
                            console.log(json);
                            // window.location.reload();
                        }
                    )
                )
        }

        this.decline =() => {

            const currentEmail = localStorage.getItem('uid');

            if ((typeof(currentEmail) == "undefined") || (currentEmail == "")) {
                alert('No login');
            };

            const token = `Token ${localStorage.getItem('token')}`;

            const body = prepareData(
                {
                    'id': this.props.tradeBundle.id,
                    'code': 3,
                    'last_message': this.state.message
                }
            );

            let url = `https://thedung.pythonanywhere.com/api/transaction/change-status/requester`;
            fetch(
                url,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : token
                    },
                    body: body
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
                            console.log(json);
                            // window.location.reload();
                        }
                    )
                )
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <Container>
                <br/>
                <Row>
                    <MessageBox
                        messageChange={this.messageChange}
                    />
                </Row>

                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                {this.state && this.state.userLocation &&
                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn orange-btn"} onClick={this.show} size="lg">{ruben.watch_map}</Button>
                </Row>
                }
                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn green-btn"} onClick={this.accept} size="lg">{ruben.accept}</Button>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn purple-btn"} onClick={this.decline} size="lg">{ruben.decline}</Button>
                </Row>







                {this.state && this.state.userLocation &&
                <Row>
                    <DirectionModal
                        userLocation={this.state.userLocation}
                        tradeLocation={this.props.tradeBundle.location}
                        isOpen={this.state.isOpen}
                        show={this.show}
                        hide={this.hide}
                    />
                </Row>
                }
            </Container>
        )
    }
}

//REQUESTER 15
class Requester15 extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }

        this.show = (e) => {
            this.setState({
                isOpen: true
            })
        }

        this.hide = (e) => {
            this.setState({
                isOpen: false
            })
        }

        this.fetchUserLocation = () => {
            const currentEmail = localStorage.getItem('uid');
            const token = `Token ${localStorage.getItem('token')}`;

            let url = `https://thedung.pythonanywhere.com/api/location/user/${currentEmail}/3`;
            fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Authorization": token
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
                            console.log(json);
                            this.setState({
                                userLocation: json
                            });
                        }
                    )
                )
        };
        this.fetchUserLocation();
    }

    render() {
        return (
            <Container>
                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                {this.state && this.state.userLocation &&
                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn orange-btn"} onClick={this.show} size="lg">{ruben.watch_map}</Button>
                </Row>
                }







                {this.state && this.state.userLocation &&
                <Row>
                    <DirectionModal
                        userLocation={this.state.userLocation}
                        tradeLocation={this.props.tradeBundle.location}
                        isOpen={this.state.isOpen}
                        show={this.show}
                        hide={this.hide}
                    />
                </Row>
                }
            </Container>
        )
    }
}

//REQUESTER 6
class Requester6 extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            message: "",
            isOpen: false
        }

        this.show = (e) => {
            this.setState({
                isOpen: true
            })
        }

        this.hide = (e) => {
            this.setState({
                isOpen: false
            })
        }

        this.messageChange = (e) => {
            console.log(e.target.value);
            this.setState({
                message: e.target.value
            })
        }

        this.fetchUserLocation = () => {
            const currentEmail = localStorage.getItem('uid');
            const token = `Token ${localStorage.getItem('token')}`;

            let url = `https://thedung.pythonanywhere.com/api/location/user/${currentEmail}/3`;
            fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Authorization" : token
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
                            console.log(json);
                            this.setState({
                                userLocation: json
                            });
                        }
                    )
                )
        };
        this.fetchUserLocation();

        this.take = () => {
            const currentEmail = localStorage.getItem('uid');

            if ((typeof(currentEmail) == "undefined") || (currentEmail == "")) {
                alert('No login');
            };

            const token = `Token ${localStorage.getItem('token')}`;

            const body = prepareData(
                {
                    'id': this.props.tradeBundle.id,
                    'code': 8,
                    'last_message': this.state.message
                }
            );

            let url = `https://thedung.pythonanywhere.com/api/transaction/change-status/requester`;
            fetch(
                url,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : token
                    },
                    body: body
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
                            console.log(json);
                            // window.location.reload();
                        }
                    )
                )
        }
    }

    render() {
        return (
            <Container>
                <br/>
                <Row>
                    <MessageBox
                        messageChange={this.messageChange}
                    />
                </Row>

                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                {this.state && this.state.userLocation &&
                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn orange-btn"} onClick={this.show} size="lg">{ruben.watch_map}</Button>
                </Row>
                }
                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn green-btn"} onClick={this.take} size="lg">{ruben.me_took_book}</Button>
                </Row>







                {this.state && this.state.userLocation &&
                <Row>
                    <DirectionModal
                        userLocation={this.state.userLocation}
                        tradeLocation={this.props.tradeBundle.location}
                        isOpen={this.state.isOpen}
                        show={this.show}
                        hide={this.hide}
                    />
                </Row>
                }
            </Container>
        )
    }
}

//REQUESTER 8
class Requester8 extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            message: ""
        }

        this.messageChange = (e) => {
            console.log(e.target.value);
            this.setState({
                message: e.target.value
            })
        }

        this.fetchUserLocation = () => {
            const currentEmail = localStorage.getItem('uid');
            const token = `Token ${localStorage.getItem('token')}`;

            let url = `https://thedung.pythonanywhere.com/api/location/user/${currentEmail}/3`;
            fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Authorization" : token
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
                            console.log(json);
                            this.setState({
                                userLocation: json
                            });
                        }
                    )
                )
        };
        this.fetchUserLocation();

        this.return = () => {
            const currentEmail = localStorage.getItem('uid');

            if ((typeof(currentEmail) == "undefined") || (currentEmail == "")) {
                alert('No login');
            };

            const token = `Token ${localStorage.getItem('token')}`;

            const body = prepareData(
                {
                    'id': this.props.tradeBundle.id,
                    'code': 11,
                    'last_message': this.state.message
                }
            );

            let url = `https://thedung.pythonanywhere.com/api/transaction/change-status/requester`;
            fetch(
                url,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : token
                    },
                    body: body
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
                            console.log(json);
                            window.location.reload();
                        }
                    )
                )
        }
    }

    render() {
        return (
            <Container>
                <br/>
                <Row>
                    <MessageBox
                        messageChange={this.messageChange}
                    />
                </Row>

                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn purple-btn"} onClick={this.return} size="lg">{ruben.me_return_book}</Button>
                </Row>

            </Container>
        )
    }
}

// REQUESTER 11
class Requester11 extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Container>

                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                <Row className="d-flex justify-content-center">
                </Row>

            </Container>
        )
    }
}

//REQUESTER 12
class Requester12 extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            message: "",
            isOpen: false
        }

        this.show = (e) => {
            this.setState({
                isOpen: true
            })
        }

        this.hide = (e) => {
            this.setState({
                isOpen: false
            })
        }

        this.messageChange = (e) => {
            console.log(e.target.value);
            this.setState({
                message: e.target.value
            })
        }

        this.fetchUserLocation = () => {
            const currentEmail = localStorage.getItem('uid');
            const token = `Token ${localStorage.getItem('token')}`;

            let url = `https://thedung.pythonanywhere.com/api/location/user/${currentEmail}/3`;
            fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Authorization" : token
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
                            console.log(json);
                            this.setState({
                                userLocation: json
                            });
                        }
                    )
                )
        };
        this.fetchUserLocation();

        this.accept = () => {
            const currentEmail = localStorage.getItem('uid');

            if ((typeof(currentEmail) === "undefined") || (currentEmail === "")) {
                alert('No login');
            };

            const token = `Token ${localStorage.getItem('token')}`;

            const body = prepareData(
                {
                    'id': this.props.tradeBundle.id,
                    'code': 16,
                    'last_message': this.state.message
                }
            );

            let url = `https://thedung.pythonanywhere.com/api/transaction/change-status/requester`;
            fetch(
                url,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : token
                    },
                    body: body
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
                            console.log(json);
                            // window.location.reload();
                        }
                    )
                )
        }

        this.decline =() => {

            const currentEmail = localStorage.getItem('uid');

            if ((typeof(currentEmail) == "undefined") || (currentEmail == "")) {
                alert('No login');
            };

            const token = `Token ${localStorage.getItem('token')}`;

            const body = prepareData(
                {
                    'id': this.props.tradeBundle.id,
                    'code': 11,
                    'last_message': this.state.message
                }
            );

            let url = `https://thedung.pythonanywhere.com/api/transaction/change-status/requester`;
            fetch(
                url,
                {
                    method: "PUT",
                    headers: {
                        "Authorization" : token
                    },
                    body: body
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
                            console.log(json);
                            // window.location.reload();
                        }
                    )
                )
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <Container>
                <br/>
                <Row>
                    <MessageBox
                        messageChange={this.messageChange}
                    />
                </Row>

                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                {this.state && this.state.userLocation &&
                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn orange-btn"} onClick={this.show} size="lg">{ruben.watch_map}</Button>
                </Row>
                }
                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn green-btn"} onClick={this.accept} size="lg">{ruben.accept}</Button>
                </Row>
                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn purple-btn"} onClick={this.decline} size="lg">{ruben.decline}</Button>
                </Row>







                {this.state && this.state.userLocation &&
                <Row>
                    <DirectionModal
                        userLocation={this.state.userLocation}
                        tradeLocation={this.props.tradeBundle.location_return}
                        isOpen={this.state.isOpen}
                        show={this.show}
                        hide={this.hide}
                    />
                </Row>
                }
            </Container>
        )
    }
}

//REQUESTER 16
class Requester16 extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }

        this.show = (e) => {
            this.setState({
                isOpen: true
            })
        }

        this.hide = (e) => {
            this.setState({
                isOpen: false
            })
        }

        this.fetchUserLocation = () => {
            const currentEmail = localStorage.getItem('uid');
            const token = `Token ${localStorage.getItem('token')}`;

            let url = `https://thedung.pythonanywhere.com/api/location/user/${currentEmail}/3`;
            fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Authorization": token
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
                            console.log(json);
                            this.setState({
                                userLocation: json
                            });
                        }
                    )
                )
        };
        this.fetchUserLocation();
    }

    render() {
        return (
            <Container>
                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />

                {this.state && this.state.userLocation &&
                <Row className="d-flex justify-content-center">
                    <Button className={"d-btn orange-btn"} onClick={this.show} size="lg">{ruben.watch_map}</Button>
                </Row>
                }







                {this.state && this.state.userLocation &&
                <Row>
                    <DirectionModal
                        userLocation={this.state.userLocation}
                        tradeLocation={this.props.tradeBundle.location_return}
                        isOpen={this.state.isOpen}
                        show={this.show}
                        hide={this.hide}
                    />
                </Row>
                }
            </Container>
        )
    }
}

// THE END Fourteen 14
class Fourteen extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <OnGoingInfo
                    tradeBundle={this.props.tradeBundle}
                />
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

function getLocation() {
    if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    localStorage.setItem('lat', `${position.coords.latitude}`);
    localStorage.setItem('lng', `${position.coords.latitude}`);
    return {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    }
}