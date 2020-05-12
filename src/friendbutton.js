import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendshipButton({ otherId }) {
    console.log("This is otherId: ", otherId);
    const [buttonText, setButtonText] = useState("");
    const [decline, setDeclineText] = useState("");
    const [declineButton, setDeclineButton] = useState(false);
    useEffect(() => {
        console.log("Button has mounted!");
        axios
            .get(`/api/friendstatus/${otherId}`)
            .then(({ data }) => {
                console.log("Data: ", data);

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
        console.log(
            "I clicked on the button and the button text is: ",
            buttonText
        );
        axios
            .post(`/api/friendship/${otherId}`, {
                text: buttonText,
                decline: decline,
            })
            .then(({ data }) => {
                console.log("This is the data: ", data);
                setButtonText(data.text);
                setDeclineButton(false);
            })
            .catch((err) => {
                console.log("Error in axios.post /friendship: ", err);
            });
    }
    return (
        <div>
            <button className="fsbtn" onClick={submit}>
                {buttonText}
            </button>
            {declineButton && (
                <button className="cancelfsbtn" onClick={submit}>
                    {decline}
                </button>
            )}
        </div>
    );
}
