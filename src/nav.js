import React from "react";

export default function Nav() {
    return (
        <div className="nav">
            {location.pathname != "/" && (
                <div onClick={() => location.replace("/")}>My Profile</div>
            )}
            {location.pathname != "/users" && (
                <div onClick={() => location.replace("/users")}>
                    Find People
                </div>
            )}
        </div>
    );
}
