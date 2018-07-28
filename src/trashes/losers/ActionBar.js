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

                                <Button color="primary" outline>{ruben.search_book}</Button>{' '}
                            </Form>
                        </Nav>

                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/login/">{ruben.signin}</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Options
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        Option 1
                                    </DropdownItem>
                                    <DropdownItem>
                                        Option 2
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem>
                                        Reset
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}
