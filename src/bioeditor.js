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
        console.log("This is my state: ", this.state);
        axios
            .post("/save-bio", this.state)
            .then(({ data }) => {
                console.log("This is the data: ", data);
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
                    <div
                        id="addbio"
                        onClick={() => this.setState({ editMode: true })}
                    >
                        Add your biography (max. 500 characters)
                    </div>
                )}
                {this.props.bio && (
                    <div className="showbio">
                        <div id="bio">{this.props.bio}</div>
                        <div
                            id="addbio"
                            onClick={() => this.setState({ editMode: true })}
                        >
                            Edit
                        </div>
                    </div>
                )}
                {this.state.editMode && (
                    <div className="enterbio">
                        <textarea
                            defaultValue={this.props.bio}
                            onChange={(e) => this.handleChange(e)}
                        />
                        <button id="savebio" onClick={(e) => this.setBio(e)}>
                            Save
                        </button>{" "}
                    </div>
                )}
            </div>
        );
    }
}
