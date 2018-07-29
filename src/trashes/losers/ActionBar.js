import React from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container,
    Row,
    Col, FormGroup, Label, Input, Form, Button
} from 'reactstrap';

import {ruben} from "../../Ruben";

import '../leftovers/actionBar.css';
import {Link} from "react-router-dom";

export default class ActionBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchKey: ""
        }

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };

        this.logOut = () => {
            let url = 'https://thedung.pythonanywhere.com/api/user/logout';
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization' : `Token ${localStorage.getItem('token')}`,
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    'email' : localStorage.getItem('uid'),
                    'token' : `Token ${localStorage.getItem('token')}`
                })
            })
                .then(response => response.json())
                .then(
                    json => {
                        if (json.error_code === 0) {
                            alert('Successfully logged out');
                            localStorage.removeItem('token');
                            localStorage.removeItem('username');
                            localStorage.removeItem('uid');
                            window.location.reload();
                        } else {
                            alert('Somethine wrong');
                            console.log(json);
                        }
                    }
                );
        }
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        return (
            <div className={"action-bar"}>
                <Navbar color="white" light expand="md">
                    <Container>
                    <NavbarBrand href="/">Infibook</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>

                        <Nav>
                            <Form inline>
                                <Input type="search" name="search" id="exampleSearch" onChange={(e)=>{this.setState({searchKey: e.target.value})}}/>

                                <Link to={`/search?key=${this.state.searchKey}`} onClick={()=>window.location.reload()}>
                                {/*<NavLink href={`/search?key=${this.state.searchKey}`}>*/}
                                    <Button color="primary" outline>{ruben.search_book}</Button>
                                </Link>
                            </Form>
                        </Nav>

                        <Nav className="ml-auto" navbar>
                            {localStorage.getItem("token") == null ?
                                [
                            <NavItem>
                                <NavLink href="/login/">{ruben.signin}</NavLink>
                            </NavItem>,
                            <NavItem>
                                <NavLink href="/register">{ruben.signup}</NavLink>
                            </NavItem>
                                ]
                                :
                                [

                            <NavItem>
                                <NavLink href="/trade">{ruben.inbox}</NavLink>
                            </NavItem>,

                            <NavItem>
                                <NavLink href="/new/book">{ruben.add_book}</NavLink>
                            </NavItem>,
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    {localStorage.getItem('uid')}
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        {ruben.setting}
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem onClick={this.logOut}>
                                        {ruben.logout}
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                                ]
                            }
                        </Nav>
                    </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}
