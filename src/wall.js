import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { wallPosts, wallPost } from "./actions";
// import { socket } from "./socket";
import ProfilePic from "./profilepic";

export default function Wall({ id }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(wallPosts(id));
        // console.log(wallPosts);
    }, [wallPostings]);

    const wallPostings = useSelector((state) => state && state.wallPosts);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            // prevent jumping to the next line
            e.preventDefault();
            console.log(e.target.value);
            dispatch(wallPost(e.target.value, id));
            e.target.value = "";
        }
    };
    return (
        <div className="wall">
            <div className="wall-container">
                {wallPostings &&
                    wallPostings.map((post) => (
                        <div key={post.id} className="message-unit">
                            <Link to={"/user/" + post.poster_id}>
                                <ProfilePic
                                    first={post.first}
                                    last={post.last}
                                    avatar={post.image}
                                />
                                <div id="name">
                                    {post.first} {post.last}
                                </div>
                            </Link>
                            <div className="date-msg-container">
                                <div className="date">{post.created_at}</div>
                                <div className="message-text">{post.text}</div>
                            </div>
                        </div>
                    ))}
                {wallPostings && !wallPostings.length && (
                    <div>Be the first to write a post</div>
                )}
            </div>
            <textarea
                placeholder="Add your message here and press enter"
                onKeyDown={(e) => keyCheck(e)}
            />
        </div>
    );
}
