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
            <ProfilePic
                first={first}
                last={last}
                imageUrl={imageUrl}
                toggleModal={toggleModal}
            />
            {first} {last}
            <BioEditor bio={bio} saveBio={saveBio} />
        </div>
    );
}
