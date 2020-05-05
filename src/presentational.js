import React from "react";
import Logo from "./logo";

export default function Presentational({ first, last, imageUrl, toggleModal }) {
    // console.log("Props in Presentational: ", props);
    imageUrl = imageUrl || "default.png";
    let name = first + " " + last;

    return (
        <div>
            <Logo />
            <div className="avatar-wrapper">
                <img
                    className="avatar"
                    src={imageUrl}
                    alt={name}
                    onClick={() => toggleModal()}
                />
            </div>
            <h2>I am the Presentational Component</h2>
            <h3>
                Hello, {first} {last}!
            </h3>
        </div>
    );
}
