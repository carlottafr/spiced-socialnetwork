import React from "react";

export default function ProfilePic({ first, last, avatar, toggleModal }) {
    avatar = avatar || "/default.png";
    return (
        <div className="avatar-wrapper">
            <img
                className="avatar"
                src={avatar}
                onError={(e) => (e.target.src = "/default.png")}
                alt={`${first} ${last}`}
                onClick={toggleModal}
            />
        </div>
    );
}
