import React from "react";
import axios from "./axios";
import { HashRouter, Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: false,
            mailerror: false,
            codeerror: false,
        };
    }

    handleChange(e) {
        console.log("e.target.value: ", e.target.value);
        console.log("e.target.name: ", e.target.name);
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    enterEmail(e) {
        e.preventDefault();
        axios
            .post("/password/reset/start", this.state)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: 2,
                    });
                } else if (data.mailerror) {
                    this.setState({
                        mailerror: true,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("Error in enterEmail: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    enterCodePw(e) {
        e.preventDefault();
        axios
            .post("/password/reset/verify", this.state)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: 3,
                    });
                } else if (data.codeerror) {
                    this.setState({
                        codeerror: true,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("Error in enterCodePw: ", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div>
                {this.state.step == 1 && (
                    <div onChange={(e) => this.handleChange(e)}>
                        <p>
                            Please enter the email address you have registered
                            with:
                        </p>
                        {this.state.error && (
                            <div>Oops, something went wrong!</div>
                        )}
                        {this.state.mailerror && (
                            <div>This email is not registered yet!</div>
                        )}
                        <div className="data">
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                            />
                            <button
                                className="yesbtn"
                                onClick={(e) => this.enterEmail(e)}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
                {this.state.step == 2 && (
                    <div onChange={(e) => this.handleChange(e)}>
                        <p>
                            Please enter the secret code sent to you via email
                            and your new password:
                        </p>
                        <div className="data">
                            <input name="code" type="text" placeholder="Code" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                            />
                            {this.state.error && (
                                <div>Oops, something went wrong!</div>
                            )}
                            {this.state.codeerror && (
                                <div>You entered an invalid code!</div>
                            )}
                            <button
                                className="yesbtn"
                                onClick={(e) => this.enterCodePw(e)}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
                {this.state.step === 3 && (
                    <div>
                        <h2>That went well!</h2>
                        <HashRouter>
                            <div>
                                You can now <Link to="/login">log in here</Link>{" "}
                                with your new password!
                            </div>
                        </HashRouter>
                    </div>
                )}
            </div>
        );
    }
}
