import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile({
    first,
    last,
    avatar,
    toggleModal,
    bio,
    saveBio,
}) {
    return (
        <div className="profile">
            <h1>My Profile</h1>
            <ProfilePic
                first={first}
                last={last}
                avatar={avatar}
                toggleModal={toggleModal}
            />
            <div className="username">
                <h2>
                    {first} {last}
                </h2>
            </div>
            <BioEditor bio={bio} saveBio={saveBio} />
        </div>
    );
}
