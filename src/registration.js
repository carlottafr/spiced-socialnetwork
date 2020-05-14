import React, { useState } from "react";
import axios from "./axios";
import { HashRouter, Link } from "react-router-dom";
import { useStatefulFields, useAuthSubmit } from "./hooks";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }
    // const [fields, handleChange] = useStatefulFields();
    handleChange(e) {
        console.log("e.target.value: ", e.target.value);
        console.log("e.target.name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            }
            // () => console.log("this.state: ", this.state)
            // cb function as 2nd argument to see the
            // current full state
        );
    }
    // const [error, submit] = useAuthSubmit("/register", fields);
    register(e) {
        e.preventDefault();
        console.log("About to register: ", this.state);
        axios
            .post("/register", this.state)
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
                console.log("Error in axios.post '/register': ", err);
            });
    }

    render() {
        return (
            <div onChange={(e) => this.handleChange(e)}>
                {this.state.error && <div>Oops, something went wrong!</div>}
                <div className="data">
                    <input name="first" type="text" placeholder="First name" />
                    <input name="last" type="text" placeholder="Last name" />
                    <input name="email" type="email" placeholder="Email" />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                    <button
                        className="yesbtn"
                        onClick={(e) => this.register(e)}
                    >
                        Register
                    </button>
                </div>
                <HashRouter>
                    <div id="login">
                        You already have an account?{" "}
                        <Link to="/login">You can log in here!</Link>
                    </div>
                </HashRouter>
            </div>
        );
    }
}
