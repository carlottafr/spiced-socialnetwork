import React from "react";
import * as io from "socket.io-client";
// establish connection
const socket = io.connect();

socket.on("yo", ({ msg }) => {
    console.log("msg: ", msg);
    socket.emit("hi", {
        msg: "Great to be here!",
    });
});
