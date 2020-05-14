import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendshipButton({ otherId }) {
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
