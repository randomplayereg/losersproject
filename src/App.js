import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {BrowserRouter, Route, Switch} from 'react-router-dom'
import ActionBar from "./trashes/losers/ActionBar";
import NavigationBar from "./trashes/losers/NavigationBar";
import Home from "./trashes/pathetic/Home";
import Footer from "./trashes/losers/Footer";
import Sharing from "./trashes/pathetic/Sharing";
import LogIn from "./trashes/autism/LogIn";
import Sharing2 from "./trashes/pathetic/Sharing2";
import Book from "./trashes/pathetic/Book";
import BookAdd from "./trashes/pathetic/BookAdd";
import Trade from "./trashes/pathetic/Trade";
import TradeDetail from "./trashes/pathetic/TradeDetail";
import Search from "./trashes/pathetic/Search";
import SearchClone from "./trashes/pathetic/SearchClone";

class App extends Component {

    Sharing2Component = ({ match }) => {
        if (match.params.country !== "" && match.params.category !== "" && match.params.subcategory !== "") {
            return (
                <Sharing2
                    country={match.params.country}
                    category={match.params.category}
                    subcategory={match.params.subcategory}
                />
            )
        }
    };

    BookComponent = ({ match }) => {
        if (match.params.id !== "") {
            return (
                <Book
                    id={match.params.id}
                />
            )
        }
    };

    AddBookComponent = ({ match }) => {
        if (match.params.id !== "") {
            return (
                <BookAdd
                    id={match.params.id}
                />
            )
        }
    };

    TradeComponent = ({ match }) => {
        if (match.params.id !== "") {
            return (
                <TradeDetail
                    id={match.params.id}
                />
            )
        }
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path={'/(|home|sharing|trade|account|book|search)'}
                               render={
                                   () =>(
                                       <div>
                                            <ActionBar/>
                                            <NavigationBar/>
                                       </div>
                                   )
                               }
                        />
                    </Switch>
                    <Switch>
                        <Route path={'(|/home)'} component={Home} exact/>

                        <Route path={'/sharing'} component={Sharing} exact/>
                        <Route path={'/sharing/:country/:category/:subcategory'} component={this.Sharing2Component}/>
                        <Route path={'/book/:id'} component={this.BookComponent} exact/>
                        <Route path={'/book/:id/add'} component={this.AddBookComponent} exact/>

                        <Route path={'/sharing/new'} component={Sharing} exact/>
                        <Route path={'/search'} component={Search} exact/>
                        {/*<Route path={'/searchclone'} component={SearchClone} exact />*/}

                        <Route path={'/trade'} component={Trade} exact/>
                        <Route path={'/trade/:id'} component={this.TradeComponent} exact/>

                        <Route path={'/account'} component={Sharing} exact/>

                        <Route path={'/login'} component={LogIn} exact/>
                        <Route path={'/register'} component={Sharing} exact/>
                        <Route path={'/pin'} component={Sharing} exact/>

                    </Switch>
                    <Footer/>
                </div>
            </BrowserRouter>
        )
  }
}

export default App;
