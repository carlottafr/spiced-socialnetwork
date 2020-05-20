import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { socket } from "./socket";
import ProfilePic from "./profilepic";

export default function Wall() {
    return <div className="wall">This is the wall!</div>;
}
