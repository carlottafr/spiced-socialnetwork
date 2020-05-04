import React from "react";
import Registration from "./registration";
import Logo from "./logo";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="welcome">
            <Logo />
            <h1>I am the welcome component</h1>
            {/* <Registration /> */}
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
