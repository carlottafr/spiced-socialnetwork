import React from "react";
import axios from "./axios";
import Presentational from "./presentational";
import Uploader from "./uploader";
import Profile from "./profile";
import Logout from "./logout";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderVisible: false,
        };
    }

    componentDidMount() {
        console.log("App mounted!");
        // axios GET to '/user' for user info
        // full name and profile pic
        axios
            .get("/user")
            .then(({ data }) => {
                this.setState({
                    first: data.first,
                    last: data.last,
                    imageUrl: data.imageUrl,
                    bio: data.bio,
                });
            })
            .catch((err) => {
                console.log("Error in axios.get /user: ", err);
            });
    }

    toggleModal() {
        console.log("The modal was clicked!");
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }
    receivePicture(arg) {
        console.log("I'm running in App: ", arg);
        this.setState({
            imageUrl: arg,
        });
    }

    saveBio(arg) {
        console.log("I'm running in App: ", arg);
        this.setState({
            bio: arg,
        });
    }

    render() {
        return (
            <div>
                <Presentational
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    toggleModal={() => this.toggleModal()}
                />
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    toggleModal={() => this.toggleModal()}
                    bio={this.state.bio}
                    saveBio={(arg) => this.saveBio(arg)}
                />
                {this.state.uploaderVisible && (
                    <Uploader
                        receivePicture={(arg) => this.receivePicture(arg)}
                        toggleModal={() => this.toggleModal()}
                    />
                )}
                <Logout />
            </div>
        );
    }
}
