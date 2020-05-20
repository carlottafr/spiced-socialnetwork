import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {
            file: null,
        };
    }

    // componentDidMount() {
    //     console.log("Uploader mounted");
    // }

    handleChange(e) {
        this.setState({
            file: e.target.files[0],
            fileName: e.target.files[0].name,
        });
    }

    uploadPicture() {
        // this.props.receivePicture("whoohoo");
        // e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/avatar-upload", formData)
            .then(({ data }) => {
                this.props.receivePicture(data.image);
                this.props.toggleModal();
            })
            .catch((err) => {
                console.log("Error in axios.post /avatar-upload: ", err);
            });
    }

    closeModal() {
        this.props.toggleModal();
    }

    render() {
        return (
            <div className="modal">
                <div className="uploader">
                    <p id="x" onClick={() => this.closeModal()}>
                        X
                    </p>
                    <h2>Change your Avatar</h2>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="file"
                        id="file"
                        className="inputfile"
                        type="file"
                        accept="jpg/*"
                    />
                    <label htmlFor="file" id="inputlabel">
                        Choose
                    </label>
                    <p className="yesbtn" onClick={() => this.uploadPicture()}>
                        Upload
                    </p>
                </div>
            </div>
        );
    }
}
