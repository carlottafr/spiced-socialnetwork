import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFriendsWannabes, acceptFriendship, endFriendship } from "./actions";
import ProfilePic from "./profilepic";

export default function Friends() {
    const dispatch = useDispatch();

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

    useEffect(() => {
        dispatch(getFriendsWannabes());
    }, []);

    return (
        <div className="friendswannabes">
            <div className="wannabes">
                <h2>The following users want to be your friends</h2>
                {wannabes.map((wannabe) => (
                    <div key={wannabe.id}>
                        {/* <Link to={"/user/" + wannabe.id}> */}
                        <ProfilePic
                            first={wannabe.first}
                            last={wannabe.last}
                            imageUrl={wannabe.image_url}
                        />
                        <div>
                            {wannabe.first} {wannabe.last}
                        </div>
                        {/* </Link> */}
                    </div>
                ))}
            </div>
            <div className="friends">
                <h2>The following users are your friends</h2>
                {friends.map((friend) => (
                    <div key={friend.id}>
                        {/* <Link to={"/user/" + friend.id}> */}
                        <ProfilePic
                            first={friend.first}
                            last={friend.last}
                            imageUrl={friend.image_url}
                        />
                        <div>
                            {friend.first} {friend.last}
                        </div>
                        {/* </Link> */}
                    </div>
                ))}
            </div>
        </div>
    );
}
