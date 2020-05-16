import React from "react";
// import axios from "./axios";
import { HashRouter, Link } from "react-router-dom";
import { useStatefulFields, useAuthSubmit } from "./hooks";

export default function Login() {
    const [fields, handleChange] = useStatefulFields();
    const [error, submit] = useAuthSubmit("/login", fields);

    return (
        <div className="data" onChange={handleChange}>
            {error && <div>Oops, something went wrong - please try again!</div>}
            <input name="email" type="email" placeholder="Email" />
            <input name="password" type="password" placeholder="Password" />
            <button className="yesbtn" onClick={submit}>
                Log In
            </button>
            <HashRouter>
                <div>
                    If you do not have an account yet,{" "}
                    <Link to="/">register here!</Link>
                </div>
                <div>
                    Have you forgotten your password?{" "}
                    <Link to="/reset">Reset it here!</Link>
                </div>
            </HashRouter>
        </div>
    );
}
