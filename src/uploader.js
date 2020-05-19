import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {
            file: null,
        };
    }

    componentDidMount() {
        console.log("Uploader mounted");
    }

    handleChange(e) {
        this.setState({
            file: e.target.files[0],
        });
        console.log("This is the current file: ", this.file);
    }

    uploadPicture() {
        // this.props.receivePicture("whoohoo");
        // e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/avatar-upload", formData)
            .then(({ data }) => {
                console.log("This is the wanted object: ", data.image);
                this.props.receivePicture(data.image);
                this.props.toggleModal();
            })
            .catch((err) => {
                console.log("Error in axios.post /avatar-upload: ", err);
            });
    }

    closeModal() {
        console.log("The modal is to be closed");
        this.props.toggleModal();
    }

    render() {
        return (
            <div className="modal">
                <div className="uploader">
                    <p id="x" onClick={() => this.closeModal()}>
                        X
                    </p>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="file"
                        type="file"
                        accept="jpg/*"
                    />
                    <button onClick={() => this.uploadPicture()}>Upload</button>
                </div>
            </div>
        );
    }
}
