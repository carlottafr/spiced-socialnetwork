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
    return state;
}
