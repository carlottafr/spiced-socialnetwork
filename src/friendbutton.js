import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendshipButton({ otherId, friendshipCheck }) {
    const [buttonText, setButtonText] = useState("");
    const [decline, setDeclineText] = useState("");
    const [declineButton, setDeclineButton] = useState(false);
    useEffect(() => {
        axios
            .get(`/api/friendstatus/${otherId}`)
            .then(({ data }) => {
                if (data.declineButton) {
                    setDeclineText("Decline Friend Request");
                    setDeclineButton(true);
                }
                setButtonText(data.text);
                if (data.text === "End Friendship") {
                    friendshipCheck(true);
                    console.log("friendshipCheck true sent out!");
                } else {
                    friendshipCheck(false);
                    console.log("friendshipCheck false sent out!");
                }
            })
            .catch((err) => {
                console.log("Error in axios.get.friendstatus: ", err);
            });
    }, []);
    function submit() {
        axios
            .post(`/api/friendship/${otherId}`, {
                text: buttonText,
            })
            .then(({ data }) => {
                if (data.friendship) {
                    friendshipCheck(true);
                } else {
                    friendshipCheck(false);
                }
                setButtonText(data.text);
                setDeclineButton(false);
            })
            .catch((err) => {
                console.log("Error in axios.post /friendship: ", err);
            });
    }

    function declineFriendship() {
        axios
            .post(`/api/friendship/${otherId}`, { text: decline })
            .then(({ data }) => {
                setButtonText(data.text);
                setDeclineButton(false);
            })
            .catch((err) => {
                console.log("Error in declineFriendship: ", err);
            });
    }
    return (
        <div className="fsbuttons">
            <button className="yesbtn" onClick={submit}>
                {buttonText}
            </button>
            {declineButton && (
                <button className="declinebtn" onClick={declineFriendship}>
                    {decline}
                </button>
            )}
        </div>
    );
}
