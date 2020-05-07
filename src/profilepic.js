import React from "react";

export default function ProfilePic({ first, last, imageUrl, toggleModal }) {
    let name = first + " " + last;
    imageUrl = imageUrl || "/default.png";
    return (
        <div className="avatar-wrapper">
            <img
                className="avatar"
                src={imageUrl}
                alt={name}
                onClick={toggleModal}
            />
        </div>
    );
}
