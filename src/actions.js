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
    await axios.post(`/api/friendship/${id}`, {
        text: "Accept Friend Request",
    });
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
    await axios.post(`/api/friendship/${id}`, {
        text: "End Friendship",
    });
    return {
        type: "UNFRIEND",
        id,
    };
}

export function chatMessages(msgs) {
    return {
        type: "GET_LAST_MESSAGES",
        msgs,
    };
}

export function chatMessage(msg) {
    return {
        type: "ADD_NEW_MESSAGE",
        msg,
    };
}
