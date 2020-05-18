// import React from "react";
import * as io from "socket.io-client";
// establish connection
// const socket = io.connect();

// socket.on("yo", ({ msg }) => {
//     console.log("msg: ", msg);
//     socket.emit("hi", {
//         msg: "Great to be here!",
//     });
// });

import { chatMessages, chatMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => store.dispatch(chatMessages(msgs)));

        socket.on("chatMessage", (msg) => {
            console.log("This is the msg to be handled by redux: ", msg);
            store.dispatch(chatMessage(msg));
        });
    }
};
