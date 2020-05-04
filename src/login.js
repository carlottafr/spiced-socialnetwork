import React from "react";
import axios from "./axios";
import { HashRouter, Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        console.log("e.target.value: ", e.target.value);
        console.log("e.target.name: ", e.target.name);
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    login(e) {
        e.preventDefault();
        console.log("About to login: ", this.state);
        axios
            .post("/login", this.state)
            .then(({ data }) => {
                console.log("Response: ", data);
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("Error in axios.post '/login': ", err);
            });
    }

    render() {
        return (
            <div className="login" onChange={(e) => this.handleChange(e)}>
                {this.state.error && (
                    <div>Oops, something went wrong - please try again!</div>
                )}
                <input name="email" type="email" placeholder="Email" />
                <input name="password" type="password" placeholder="Password" />
                <button onClick={(e) => this.login(e)}>Log In</button>
                <HashRouter>
                    <div id="loglinks">
                        <div>
                            If you do not have an account yet,{" "}
                            <Link to="/">register here!</Link>
                        </div>
                        <div>
                            Have you forgotten your password?
                            <Link to="/reset">Reset it here!</Link>
                        </div>
                    </div>
                </HashRouter>
            </div>
        );
    }
}
