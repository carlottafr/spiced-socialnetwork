import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { imagePost, wallPosts, wallPost } from "./actions";
// import { socket } from "./socket";
import ProfilePic from "./profilepic";

export default function Wall({ id }) {
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);

    useEffect(() => {
        dispatch(wallPosts(id));
        // console.log(wallPosts);
    }, [wallPostings]);

    const wallPostings = useSelector((state) => state && state.wallPosts);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            // prevent jumping to the next line
            e.preventDefault();
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
                                <div className="message-text">
                                    {post.text && post.text}
                                    {post.picture && (
                                        <div className="imagepost">
                                            <img src={post.picture} />
                                        </div>
                                    )}
                                </div>
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
            <div className="pic-upload-container">
                <input
                    onChange={(e) => setFile(e.target.files[0])}
                    name="file"
                    id="file"
                    className="inputfile"
                    type="file"
                    accept="jpg/*"
                />
                <label htmlFor="file" id="inputlabel">
                    Choose Picture
                </label>
                <div
                    id="inputlabel"
                    onClick={() => dispatch(imagePost(file, id))}
                >
                    Post Picture
                </div>
            </div>
        </div>
    );
}
