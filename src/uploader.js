import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log("Uploader mounted");
    }

    uploadPicture() {
        this.props.receivePicture("whoohoo");
    }

    closeModal() {
        console.log("The modal is to be closed");
        this.props.toggleModal();
    }

    render() {
        return (
            <div>
                <p onClick={() => this.closeModal()}>X</p>
                <input type="file" accept="jpg/*" />
                <button onClick={() => this.uploadPicture()}>Upload</button>
            </div>
        );
    }
}
