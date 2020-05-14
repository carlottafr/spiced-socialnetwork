import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            draftBio: null,
            editMode: false,
        };
    }

    handleChange(e) {
        // console.log("e.target: ", e.target.value);
        this.setState({
            draftBio: e.target.value,
        });
    }

    setBio() {
        this.setState({
            editMode: false,
        });
        axios
            .post("/save-bio", this.state)
            .then(({ data }) => {
                this.props.saveBio(data.bio);
            })
            .catch((err) => {
                console.log("Error in axios.post /save-bio: ", err);
            });
    }

    render() {
        return (
            <div className="bio-edit">
                {!this.props.bio && (
                    <p
                        id="addbio"
                        onClick={() => this.setState({ editMode: true })}
                    >
                        Add your biography (max. 500 characters)
                    </p>
                )}
                {this.props.bio && (
                    <div className="showbio">
                        <div className="bio">{this.props.bio}</div>
                        <p
                            id="editbio"
                            onClick={() => this.setState({ editMode: true })}
                        >
                            Edit
                        </p>
                    </div>
                )}
                {this.state.editMode && (
                    <div className="enterbio">
                        <textarea
                            defaultValue={this.props.bio}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button
                            className="yesbtn"
                            onClick={(e) => this.setBio(e)}
                        >
                            Save
                        </button>
                        <button
                            className="declinebtn"
                            onClick={() => this.setState({ editMode: false })}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
