import React from "react";
import { HashRouter, Link } from "react-router-dom";
// custom hooks
import { useStatefulFields, useAuthSubmit } from "./hooks";

export default function Registration() {
    const [fields, handleChange] = useStatefulFields();
    const [error, submit] = useAuthSubmit("/register", fields);

    return (
        <div onChange={handleChange}>
            {error && <div>Oops, something went wrong!</div>}
            <div className="data">
                <input name="first" type="text" placeholder="First name" />
                <input name="last" type="text" placeholder="Last name" />
                <input name="email" type="email" placeholder="Email" />
                <input name="password" type="password" placeholder="Password" />
                <button className="yesbtn" onClick={submit}>
                    Register
                </button>
            </div>
            <HashRouter>
                <div id="login">
                    You already have an account?
                    <br />
                    <Link to="/login">You can log in here!</Link>
                </div>
            </HashRouter>
        </div>
    );
}
