import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.chatMessages);
    // console.log("Last 10 chatMessages: ", chatMessages);

    useEffect(() => {
        // console.log("Chat hooks component has mounted!");
        console.log("elemRef: ", elemRef);
        console.log("scrollTop: ", elemRef.current.scrollTop);
        console.log("clientHeight: ", elemRef.current.clientHeight);
        console.log("scrollHeight: ", elemRef.current.scrollHeight);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);

    const keyCheck = (e) => {
        // console.log("Key pressed: ", e.key);
        if (e.key === "Enter") {
            // prevent jumping to the next line
            e.preventDefault();
            // console.log("Value: ", e.target.value);
            socket.emit("newMessage", e.target.value);
            e.target.value = "";
        }
    };
    return (
        <div className="chat">
            <h3>Welcome to Chat!</h3>
            <div className="chatmsg-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((message) => (
                        <div key={message.chats_id} className="message-unit">
                            <Link to={"/user/" + message.id}>
                                <ProfilePic
                                    first={message.first}
                                    last={message.last}
                                    imageUrl={message.image_url}
                                />
                                <div>
                                    {message.first} {message.last}
                                </div>
                            </Link>
                            <div id="date">{message.created_at}</div>
                            <div className="messagetext">{message.message}</div>
                        </div>
                    ))}
            </div>
            <textarea
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            />
        </div>
    );
}
