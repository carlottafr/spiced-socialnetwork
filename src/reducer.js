// 2 args: global state (when there is none, when it is
// called the first time, a global state is created as an
// empty object) and action
export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes,
        };
    }

    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((wannabe) => {
                if (wannabe.id == action.id) {
                    return {
                        ...wannabe,
                        accepted: true,
                    };
                } else {
                    return wannabe;
                }
            }),
        };
    }

    if (action.type == "UNFRIEND" || action.type == "DECLINE_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                (friend) => friend.id != action.id
            ),
        };
    }

    if (action.type == "GET_LAST_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.msgs,
        };
    }

    if (action.type == "ADD_NEW_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.msg],
        };
        // console.log(state);
    }

    return state;
}
