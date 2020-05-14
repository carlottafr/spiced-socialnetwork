import React from "react";
import Logout from "./logout";
import { Link } from "react-router-dom";

export default function Nav() {
    return (
        <div className="nav">
            <div>
                <Logout />
            </div>
            <div>
                <Link to="/users">Find People</Link>
            </div>
            <div>
                <Link to="/friends">Friends</Link>
            </div>
            <div>
                <Link to="/">My Profile</Link>
            </div>
        </div>
    );
}
