import axios from "./axios";

export async function uploadAvatar(file) {
    var formData = new FormData();
    formData.append("file", file);
    const { data } = await axios.post("/avatar-upload", formData);
    return {
        type: "UPLOAD_AVATAR",
        imageUrl: data.imageUrl,
    };
}

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
