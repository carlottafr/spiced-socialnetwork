import React from "react";
import Presentational from "./presentational";
import Uploader from "./uploader";
import axios from "./axios";

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

    render() {
        return (
            <div>
                <h1>This is the App Component</h1>
                <h2 onClick={() => this.toggleModal()}>
                    Changing State with a method!
                </h2>
                <Presentational
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    toggleModal={() => this.toggleModal()}
                />
                {this.state.uploaderVisible && (
                    <Uploader
                        receivePicture={(arg) => this.receivePicture(arg)}
                        toggleModal={() => this.toggleModal()}
                    />
                )}
            </div>
        );
    }
}
