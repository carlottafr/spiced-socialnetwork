import axios from "./axios";

export async function getFriendsWannabes() {
    const { data } = await axios.get("/friends-wannabes");
    // console.log(data);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friendsWannabes: data,
    };
}

export async function acceptFriendship(id) {
    const { data } = await axios.post(`/api/friendship/${id}`, {
        text: "Accept Friend Request",
    });
    console.log(data);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id,
    };
}

export async function declineFriendship(id) {
    await axios.post(`/api/friendship/${id}`, {
        text: "Decline Friend Request",
    });
    return {
        type: "DECLINE_FRIEND_REQUEST",
        id,
    };
}

export async function endFriendship(id) {
    const { data } = await axios.post(`/api/friendship/${id}`, {
        text: "End Friendship",
    });
    console.log(data);
    return {
        type: "UNFRIEND",
        id,
    };
}
