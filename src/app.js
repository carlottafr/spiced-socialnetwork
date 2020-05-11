import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import Presentational from "./presentational";
import FindPeople from "./findpeople";
import Uploader from "./uploader";
import Profile from "./profile";
import Logout from "./logout";
import OtherProfile from "./otherprofile";

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
                    id: data.id,
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
        this.setState({
            bio: arg,
        });
    }

    render() {
        if (!this.state.id) {
            return null;
        } else {
            return (
                <div>
                    <BrowserRouter>
                        <div>
                            <Presentational
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                toggleModal={() => this.toggleModal()}
                            />

                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        first={this.state.first}
                                        last={this.state.last}
                                        imageUrl={this.state.imageUrl}
                                        toggleModal={() => this.toggleModal()}
                                        bio={this.state.bio}
                                        saveBio={(arg) => this.saveBio(arg)}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/user/:id"
                                render={(props) => (
                                    <OtherProfile
                                        key={props.match.url}
                                        match={props.match}
                                        history={props.history}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/users"
                                render={() => <FindPeople />}
                            />
                            {this.state.uploaderVisible && (
                                <Uploader
                                    receivePicture={(arg) =>
                                        this.receivePicture(arg)
                                    }
                                    toggleModal={() => this.toggleModal()}
                                />
                            )}
                        </div>
                    </BrowserRouter>
                </div>
            );
        }
    }
}
