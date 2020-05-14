import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getFriendsWannabes,
    acceptFriendship,
    declineFriendship,
    endFriendship,
} from "./actions";
import ProfilePic from "./profilepic";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFriendsWannabes());
    }, []);

    const wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => user.accepted == false)
    );

    const friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => user.accepted == true)
    );
    console.log("Friends: ", friends);
    console.log("Wannabes: ", wannabes);

    return (
        <div className="friendswannabes">
            <h2>The following users want to be your friends</h2>
            <div className="users">
                {wannabes &&
                    wannabes.map((wannabe) => (
                        <div key={wannabe.id}>
                            <Link to={"/user/" + wannabe.id}>
                                <ProfilePic
                                    first={wannabe.first}
                                    last={wannabe.last}
                                    imageUrl={wannabe.image_url}
                                />
                                <div>
                                    {wannabe.first} {wannabe.last}
                                </div>
                            </Link>
                            <button
                                className="yesbtn"
                                onClick={() =>
                                    dispatch(acceptFriendship(wannabe.id))
                                }
                            >
                                Accept Friend Request
                            </button>
                            <button
                                className="declinebtn"
                                onClick={() =>
                                    dispatch(declineFriendship(wannabe.id))
                                }
                            >
                                Decline Friend Request
                            </button>
                        </div>
                    ))}
            </div>
            <h2>The following users are your friends</h2>
            <div className="users">
                {friends &&
                    friends.map((friend) => (
                        <div key={friend.id}>
                            <Link to={"/user/" + friend.id}>
                                <ProfilePic
                                    first={friend.first}
                                    last={friend.last}
                                    imageUrl={friend.image_url}
                                />
                                <div>
                                    {friend.first} {friend.last}
                                </div>
                            </Link>
                            <button
                                className="yesbtn"
                                onClick={() =>
                                    dispatch(endFriendship(friend.id))
                                }
                            >
                                End Friendship
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
