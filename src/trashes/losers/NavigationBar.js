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

import '../leftovers/navigationBar.css';
import '../abbadoned/ovNavLink.css';
import '../abbadoned/ovPrimBtnOutline.css';

export default class NavigationBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        return (
            <div className={"navigation-barca"}>
                <Container>
                    <Navbar color="light" light expand="md">
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <Nav className="m-auto" navbar>
                                    <NavItem>
                                        <NavLink href="/">{ruben.home}</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink href="/browse">{ruben.browse}</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink href="/exchange">{ruben.exchange}</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink href="/profile">{ruben.setting}</NavLink>
                                    </NavItem>
                                </Nav>
                            </Collapse>
                    </Navbar>
                </Container>
            </div>
        );
    }
}
