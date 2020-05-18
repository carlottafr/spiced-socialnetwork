import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.chatMessages);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            // prevent jumping to the next line
            e.preventDefault();
            socket.emit("newMessage", e.target.value);
            e.target.value = "";
        }
    };
    return (
        <div className="chat">
            <img src="./chat_jungle.jpg" id="chatbg" />
            <div className="chat-header">
                <h2>Plantician Lounge</h2>
            </div>
            <div className="chatmsg-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((message) => (
                        <div key={message.chats_id} className="message-unit">
                            <Link to={"/user/" + message.sender_id}>
                                <ProfilePic
                                    first={message.first}
                                    last={message.last}
                                    imageUrl={message.image_url}
                                />
                                <div id="name">
                                    {message.first} {message.last}
                                </div>
                            </Link>
                            <div className="date-msg-container">
                                <div className="date">{message.created_at}</div>
                                <div className="message-text">
                                    {message.message}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <textarea
                placeholder="Add your message here and press enter"
                onKeyDown={keyCheck}
            />
        </div>
    );
}
