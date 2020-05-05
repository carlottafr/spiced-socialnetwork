import React from "react";
import Presentational from "./presentational";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "Noam",
            last: "Chomsky",
            uploaderVisible: false,
        };
    }

    componentDidMount() {
        console.log("App mounted!");
        // axios GET to '/user' for user info
        // full name and profile pic
    }

    toggleModal() {
        console.log("The modal was clicked!");
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }
    receivePicture(arg) {
        console.log("I'm running in App: ", arg);
    }

    render() {
        return (
            <div>
                <h1>This is the App Component</h1>
                <h2 onClick={(e) => this.toggleModal(e)}>
                    Changing State with a method!
                </h2>
                <Presentational
                    first={this.state.first}
                    last={this.state.last}
                    imgUrl={this.state.imageUrl}
                    toggleModal={this.toggleModal}
                />
                {this.state.uploaderVisible && (
                    <Uploader
                        receivePicture={this.receivePicture}
                        toggleModal={this.toggleModal}
                    />
                )}
            </div>
        );
    }
}
