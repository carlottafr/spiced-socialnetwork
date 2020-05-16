import React, { useState } from "react";
// import axios from "./axios";
import { useDispatch } from "react-redux";
import { uploadAvatar } from "./actions";

export default function Uploader({ toggleModal }) {
    // constructor() {
    //     super();
    //     this.state = {
    //         file: null,
    //     };
    // }

    // componentDidMount() {
    //     console.log("Uploader mounted");
    // }

    // handleChange(e) {
    //     this.setState({
    //         file: e.target.files[0],
    //     });
    //     console.log("This is the current file: ", this.file);
    // }

    const [file, setFile] = useState(null);
    const dispatch = useDispatch();

    // function uploadPicture() {
    //     var formData = new FormData();
    //     formData.append("file", file);
    //     axios
    //         .post("/avatar-upload", formData)
    //         .then(({ data }) => {
    //             console.log("This is the wanted object: ", data.imageUrl);
    //             this.props.receivePicture(data.imageUrl);
    //             this.props.toggleModal();
    //         })
    //         .catch((err) => {
    //             console.log("Error in axios.post /avatar-upload: ", err);
    //         });
    // }

    // function closeModal() {
    // console.log("The modal is to be closed");
    //     toggleModal();
    // }

    // render() {
    return (
        <div className="modal">
            <div className="uploader">
                <p id="x" onClick={toggleModal}>
                    X
                </p>
                <input
                    onChange={({ target }) => {
                        setFile(target.value);
                    }}
                    name="file"
                    type="file"
                    accept="jpg/*"
                />
                <button onClick={() => dispatch(uploadAvatar(file))}>
                    Upload
                </button>
            </div>
        </div>
    );
    // }
}
