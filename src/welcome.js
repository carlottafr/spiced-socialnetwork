import React from "react";
import Registration from "./registration";
import Logo from "./logo";
import Login from "./login";
import ResetPassword from "./reset";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="welcome">
            <Logo />
            <h1>I am the welcome component</h1>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}