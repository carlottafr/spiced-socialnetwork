import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile({
    first,
    last,
    imageUrl,
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
                imageUrl={imageUrl}
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
